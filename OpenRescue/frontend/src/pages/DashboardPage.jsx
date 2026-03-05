import FiltersBar from "../components/FiltersBar";
import StatsCards from "../components/StatsCards";
import IncidentTable from "../components/IncidentTable";
import IncidentMap from "../components/IncidentMap";
import ChartsPanel from "../components/ChartsPanel";
import AllocationPanel from "../components/AllocationPanel";

export default function DashboardPage({
  searchTerm,
  severityFilter,
  sortBy,
  onSearchChange,
  onSeverityChange,
  onSortChange,
  loadError,
  socketError,
  stats,
  recentIncidents,
  isLoading,
  filteredIncidents,
}) {
  return (
    <main className="layout">
      <section className="panel stack">
        <FiltersBar
          searchTerm={searchTerm}
          severityFilter={severityFilter}
          sortBy={sortBy}
          onSearchChange={onSearchChange}
          onSeverityChange={onSeverityChange}
          onSortChange={onSortChange}
        />
        {loadError ? <p className="status statusError">{loadError}</p> : null}
        {socketError ? <p className="status statusWarning">{socketError}</p> : null}
        <StatsCards total={stats.total} high={stats.high} />
        <ChartsPanel incidents={filteredIncidents} />
        <AllocationPanel incidents={filteredIncidents} />
        <IncidentTable incidents={recentIncidents} isLoading={isLoading} />
      </section>

      <section className="panel mapPanel">
        <IncidentMap incidents={filteredIncidents} />
      </section>
    </main>
  );
}
