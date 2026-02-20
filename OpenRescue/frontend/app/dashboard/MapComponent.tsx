"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

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
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    fetch("http://127.0.0.1:8000/incidents")
      .then((res) => res.json())
      .then((data) => setIncidents(data))
      .catch((err) => console.error("Fetch error:", err));

    // WebSocket connection
    const socket = new WebSocket("ws://localhost:8000/ws");


    socket.onmessage = (event) => {
      const newIncident = JSON.parse(event.data);
      setIncidents((prev) => [...prev, newIncident]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
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
