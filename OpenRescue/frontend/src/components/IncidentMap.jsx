import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { markerColor, normalizeSeverity } from "../utils/severity";

function buildMarkerIcon(severity) {
  const color = markerColor(severity);
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

function MapClickPicker({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export default function IncidentMap({ incidents, onMapPick }) {
  return (
    <MapContainer center={[12.9716, 77.5946]} zoom={12} className="map">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {onMapPick ? <MapClickPicker onPick={onMapPick} /> : null}
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lon]}
          icon={buildMarkerIcon(incident.severity)}
        >
          <Popup>
            <div>
              <strong>{normalizeSeverity(incident.severity)}</strong>
              <p>{incident.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
