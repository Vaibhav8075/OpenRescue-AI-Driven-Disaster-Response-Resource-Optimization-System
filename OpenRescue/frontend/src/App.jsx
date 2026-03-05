import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { BACKEND_BASE_URL } from "./config";
import DashboardPage from "./pages/DashboardPage";
import ReportPage from "./pages/ReportPage";
import DemoModeToggle from "./components/DemoModeToggle";
import { normalizeSeverity, severityScore } from "./utils/severity";
import { getWebSocketUrl } from "./utils/network";
import { mockIncidents } from "./mock/incidents";

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("12.9716");
  const [longitude, setLongitude] = useState("77.5946");
  const [formStatus, setFormStatus] = useState("");
  const [loadError, setLoadError] = useState("");
  const [socketError, setSocketError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const socket = new WebSocket(getWebSocketUrl(BACKEND_BASE_URL));

    async function loadIncidents() {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await fetch(`${BACKEND_BASE_URL}/incidents`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch incidents (${response.status})`);
        }
        const data = await response.json();
        setIncidents(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadIncidents();

    socket.onmessage = (event) => {
      setSocketError("");
      const incoming = JSON.parse(event.data);
      setIncidents((current) => {
        const exists = current.some((item) => item.id === incoming.id);
        return exists ? current : [...current, incoming];
      });
    };

    socket.onerror = () => {
      setSocketError("WebSocket disconnected. Live updates are unavailable.");
    };

    return () => {
      controller.abort();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  const dataSource = useMemo(() => (demoMode ? mockIncidents : incidents), [demoMode, incidents]);

  const filteredIncidents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const list = dataSource.filter((incident) => {
      const severity = normalizeSeverity(incident.severity);
      const severityMatched = severityFilter === "All" || severity === severityFilter;
      const descriptionMatched =
        search.length === 0 || String(incident.description ?? "").toLowerCase().includes(search);
      return severityMatched && descriptionMatched;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "oldest") {
        return a.id - b.id;
      }
      if (sortBy === "severity_desc") {
        return severityScore(b.severity) - severityScore(a.severity) || b.id - a.id;
      }
      if (sortBy === "severity_asc") {
        return severityScore(a.severity) - severityScore(b.severity) || b.id - a.id;
      }
      return b.id - a.id;
    });

    return sorted;
  }, [dataSource, searchTerm, severityFilter, sortBy]);

  const stats = useMemo(() => {
    const total = filteredIncidents.length;
    const high = filteredIncidents.filter((incident) => severityScore(incident.severity) >= 3).length;
    return { total, high };
  }, [filteredIncidents]);

  const recentIncidents = useMemo(() => {
    return filteredIncidents.slice(0, 10);
  }, [filteredIncidents]);

  async function onSubmit(event) {
    event.preventDefault();
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!description.trim()) {
      setFormStatus("Description is required.");
      return;
    }
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setFormStatus("Valid latitude and longitude are required.");
      return;
    }

    setSubmitting(true);
    setFormStatus("");
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          latitude: lat,
          longitude: lon,
        }),
      });
      if (!response.ok) {
        throw new Error(`Submission failed (${response.status})`);
      }
      const created = await response.json();
      setIncidents((current) => {
        const exists = current.some((item) => item.id === created.id);
        return exists ? current : [...current, created];
      });
      setDescription("");
      setFormStatus(`Incident #${created.id} submitted with ${normalizeSeverity(created.severity)} severity.`);
    } catch (error) {
      setFormStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  function onMapPick(lat, lon) {
    setLatitude(lat.toFixed(6));
    setLongitude(lon.toFixed(6));
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>OpenRescue Control Room</h1>
        <nav className="topnav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
          >
            Report
          </NavLink>
          <DemoModeToggle enabled={demoMode} onToggle={() => setDemoMode((current) => !current)} />
        </nav>
      </header>

      <Routes>
        <Route
          path="/report"
          element={
            <ReportPage
              description={description}
              latitude={latitude}
              longitude={longitude}
              submitting={submitting}
              formStatus={formStatus}
              onDescriptionChange={setDescription}
              onLatitudeChange={setLatitude}
              onLongitudeChange={setLongitude}
              onSubmit={onSubmit}
              incidents={dataSource}
              onMapPick={onMapPick}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              searchTerm={searchTerm}
              severityFilter={severityFilter}
              sortBy={sortBy}
              onSearchChange={setSearchTerm}
              onSeverityChange={setSeverityFilter}
              onSortChange={setSortBy}
              loadError={loadError}
              socketError={socketError}
              stats={stats}
              recentIncidents={recentIncidents}
              isLoading={isLoading}
              filteredIncidents={filteredIncidents}
            />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}
