import { normalizeSeverity, severityScore } from "../utils/severity";

const severityOrder = ["Low", "Medium", "High", "Critical"];

function severityCount(incidents) {
  const base = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  incidents.forEach((incident) => {
    const label = normalizeSeverity(incident.severity);
    base[label] = (base[label] ?? 0) + 1;
  });
  return base;
}

function trendPoints(incidents) {
  const last = [...incidents].sort((a, b) => a.id - b.id).slice(-12);
  if (last.length === 0) return "";
  if (last.length === 1) return "10,50";

  return last
    .map((incident, index) => {
      const x = 10 + (index * 180) / (last.length - 1);
      const y = 90 - severityScore(incident.severity) * 18;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function ChartsPanel({ incidents }) {
  const counts = severityCount(incidents);
  const total = incidents.length || 1;
  const points = trendPoints(incidents);

  return (
    <div className="chartsPanel">
      <div className="chartCard">
        <h2>Severity Distribution</h2>
        <div className="barList">
          {severityOrder.map((label) => {
            const value = counts[label];
            const width = (value / total) * 100;
            return (
              <div key={label} className="barRow">
                <span>{label}</span>
                <div className="barTrack">
                  <div className={`barFill ${label.toLowerCase()}`} style={{ width: `${width}%` }} />
                </div>
                <strong>{value}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chartCard">
        <h2>Severity Trend (Last 12)</h2>
        <svg viewBox="0 0 200 100" className="trendSvg">
          <polyline
            points={points}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
