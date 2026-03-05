import { useMemo } from "react";
import { normalizeSeverity } from "../utils/severity";
import { createAllocations } from "../utils/allocation";

export default function AllocationPanel({ incidents }) {
  const result = useMemo(() => createAllocations(incidents), [incidents]);

  return (
    <div className="allocationPanel">
      <h2>Resource Allocation</h2>
      <p className="allocationMeta">
        Assigned: {result.assignments.length} | Unassigned: {result.unassigned.length}
      </p>

      <div className="allocationTableWrap">
        <table>
          <thead>
            <tr>
              <th>Incident</th>
              <th>Severity</th>
              <th>Team</th>
              <th>Distance (km)</th>
            </tr>
          </thead>
          <tbody>
            {result.assignments.slice(0, 8).map((item) => (
              <tr key={`${item.incidentId}-${item.teamId}`}>
                <td>#{item.incidentId}</td>
                <td>{normalizeSeverity(item.severity)}</td>
                <td>{item.teamName}</td>
                <td>{item.distanceKm}</td>
              </tr>
            ))}
            {result.assignments.length === 0 ? (
              <tr>
                <td colSpan={4}>No incidents available for allocation.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {result.unassigned.length > 0 ? (
        <div className="unassignedBox">
          <strong>Unassigned incidents:</strong>{" "}
          {result.unassigned.map((item) => `#${item.incidentId}`).join(", ")}
        </div>
      ) : null}
    </div>
  );
}
