const severityOptions = ["All", "Low", "Medium", "High", "Critical"];
const sortOptions = [
  { value: "latest", label: "Latest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "severity_desc", label: "Highest Severity" },
  { value: "severity_asc", label: "Lowest Severity" },
];

export default function FiltersBar({
  searchTerm,
  severityFilter,
  sortBy,
  onSearchChange,
  onSeverityChange,
  onSortChange,
}) {
  return (
    <div className="filterBar">
      <h2>Incident Filters</h2>
      <div className="filterGrid">
        <input
          type="text"
          placeholder="Search description"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select value={severityFilter} onChange={(event) => onSeverityChange(event.target.value)}>
          {severityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
