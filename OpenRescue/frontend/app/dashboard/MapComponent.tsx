"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const backendBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

function getWebSocketUrl(httpUrl: string) {
  const url = new URL(httpUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws";
  url.search = "";
  url.hash = "";
  return url.toString();
}

type Incident = {
  id: number;
  description: string;
  lat: number;
  lon: number;
  severity: string;
  assigned_team?: {
    name: string;
  };
};

function getMarkerIcon(severity: string) {
  let color = "green";

  if (severity === "Critical") color = "red";
  else if (severity === "High") color = "orange";
  else if (severity === "Medium") color = "yellow";
  else if (severity === "Low") color = "green";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export default function MapComponent() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let unmounting = false;

    const loadIncidents = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/incidents`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unexpected status: ${response.status}`);
        }

        const data: Incident[] = await response.json();
        setIncidents(data);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Failed to fetch incidents from backend:", error);
      }
    };

    loadIncidents();

    const socket = new WebSocket(getWebSocketUrl(backendBaseUrl));

    socket.onmessage = (event) => {
      const newIncident: Incident = JSON.parse(event.data);
      setIncidents((prev) => [...prev, newIncident]);
    };

    socket.onerror = () => {
      if (!unmounting) {
        console.error("WebSocket connection error. Check backend /ws.");
      }
    };

    return () => {
      unmounting = true;
      controller.abort();
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close(1000, "MapComponent unmounted");
      }
    };
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[12.97, 77.59]}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.lat, incident.lon]}
            icon={getMarkerIcon(incident.severity)}
          >
            <Popup>
              <div>
                <h2 className="font-bold text-lg">
                  {incident.severity}
                </h2>
                <p>{incident.description}</p>
                {incident.assigned_team && (
                  <p className="mt-2 text-sm text-gray-600">
                    Assigned: {incident.assigned_team.name}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
