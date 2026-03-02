import { normalizeSeverity } from "../utils/severity";

export default function IncidentTable({ incidents }) {
  return (
    <div className="tableWrap">
      <h2>Recent Incidents</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Severity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td>{normalizeSeverity(incident.severity)}</td>
              <td>{incident.description}</td>
            </tr>
          ))}
          {incidents.length === 0 ? (
            <tr>
              <td colSpan={3}>No incidents yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
