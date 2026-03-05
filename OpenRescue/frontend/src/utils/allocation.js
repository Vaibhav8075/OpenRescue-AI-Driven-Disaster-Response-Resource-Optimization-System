import { severityScore } from "./severity";

const defaultTeams = [
  { id: "T1", name: "Team Alpha", lat: 12.968, lon: 77.594 },
  { id: "T2", name: "Team Bravo", lat: 12.982, lon: 77.572 },
  { id: "T3", name: "Team Charlie", lat: 12.954, lon: 77.612 },
  { id: "T4", name: "Team Delta", lat: 12.944, lon: 77.581 },
];

function distanceKm(aLat, aLon, bLat, bLon) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earthRadius * y;
}

export function createAllocations(incidents, teams = defaultTeams) {
  const teamPool = teams.map((team) => ({ ...team, assigned: false }));
  const sortedIncidents = [...incidents].sort((a, b) => {
    const bySeverity = severityScore(b.severity) - severityScore(a.severity);
    if (bySeverity !== 0) return bySeverity;
    return b.id - a.id;
  });

  const assignments = [];
  const unassigned = [];

  sortedIncidents.forEach((incident) => {
    const candidates = teamPool.filter((team) => !team.assigned);
    if (candidates.length === 0) {
      unassigned.push({
        incidentId: incident.id,
        reason: "No available team left in current cycle",
      });
      return;
    }

    const nearestTeam = candidates.reduce((best, current) => {
      const bestDistance = distanceKm(incident.lat, incident.lon, best.lat, best.lon);
      const currentDistance = distanceKm(incident.lat, incident.lon, current.lat, current.lon);
      return currentDistance < bestDistance ? current : best;
    });

    nearestTeam.assigned = true;
    const km = distanceKm(incident.lat, incident.lon, nearestTeam.lat, nearestTeam.lon);
    assignments.push({
      incidentId: incident.id,
      teamId: nearestTeam.id,
      teamName: nearestTeam.name,
      distanceKm: km.toFixed(2),
      severity: incident.severity,
    });
  });

  return { assignments, unassigned };
}
