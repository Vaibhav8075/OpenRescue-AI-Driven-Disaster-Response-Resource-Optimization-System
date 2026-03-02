const severityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function normalizeSeverity(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return "Low";
  if (text === "critical" || text === "severe") return "Critical";
  if (text === "high") return "High";
  if (text === "medium" || text === "moderate") return "Medium";
  return "Low";
}

export function severityScore(value) {
  const normalized = normalizeSeverity(value).toLowerCase();
  return severityWeight[normalized] ?? 1;
}

export function markerColor(value) {
  const label = normalizeSeverity(value).toLowerCase();
  if (label === "critical") return "red";
  if (label === "high") return "orange";
  if (label === "medium") return "yellow";
  return "green";
}
