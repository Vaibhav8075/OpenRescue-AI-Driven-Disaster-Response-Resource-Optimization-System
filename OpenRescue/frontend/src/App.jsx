import { useEffect, useMemo, useState } from "react";
import { BACKEND_BASE_URL } from "./config";
import ReportForm from "./components/ReportForm";
import StatsCards from "./components/StatsCards";
import IncidentTable from "./components/IncidentTable";
import IncidentMap from "./components/IncidentMap";
import { normalizeSeverity, severityScore } from "./utils/severity";
import { getWebSocketUrl } from "./utils/network";

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("12.9716");
  const [longitude, setLongitude] = useState("77.5946");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const socket = new WebSocket(getWebSocketUrl(BACKEND_BASE_URL));

    async function loadIncidents() {
      try {
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
          setStatus(error.message);
        }
      }
    }

    loadIncidents();

    socket.onmessage = (event) => {
      const incoming = JSON.parse(event.data);
      setIncidents((current) => {
        const exists = current.some((item) => item.id === incoming.id);
        return exists ? current : [...current, incoming];
      });
    };

    socket.onerror = () => {
      setStatus("WebSocket disconnected. Check backend server.");
    };

    return () => {
      controller.abort();
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  const stats = useMemo(() => {
    const total = incidents.length;
    const high = incidents.filter((incident) => severityScore(incident.severity) >= 3).length;
    return { total, high };
  }, [incidents]);

  const recentIncidents = useMemo(() => {
    return [...incidents].sort((a, b) => b.id - a.id).slice(0, 10);
  }, [incidents]);

  async function onSubmit(event) {
    event.preventDefault();
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!description.trim()) {
      setStatus("Description is required.");
      return;
    }
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setStatus("Valid latitude and longitude are required.");
      return;
    }

    setSubmitting(true);
    setStatus("");
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
      setStatus(`Incident #${created.id} submitted with ${normalizeSeverity(created.severity)} severity.`);
    } catch (error) {
      setStatus(error.message);
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
      </header>

      <main className="layout">
        <section className="panel stack">
          <ReportForm
            description={description}
            latitude={latitude}
            longitude={longitude}
            submitting={submitting}
            status={status}
            onDescriptionChange={setDescription}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
            onSubmit={onSubmit}
          />
          <StatsCards total={stats.total} high={stats.high} />
          <IncidentTable incidents={recentIncidents} />
        </section>

        <section className="panel mapPanel">
          <IncidentMap incidents={incidents} onMapPick={onMapPick} />
        </section>
      </main>
    </div>
  );
}
