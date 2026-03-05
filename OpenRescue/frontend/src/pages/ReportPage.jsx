import ReportForm from "../components/ReportForm";
import IncidentMap from "../components/IncidentMap";

export default function ReportPage({
  description,
  latitude,
  longitude,
  submitting,
  formStatus,
  onDescriptionChange,
  onLatitudeChange,
  onLongitudeChange,
  onSubmit,
  incidents,
  onMapPick,
}) {
  return (
    <main className="layout">
      <section className="panel stack">
        <ReportForm
          description={description}
          latitude={latitude}
          longitude={longitude}
          submitting={submitting}
          status={formStatus}
          onDescriptionChange={onDescriptionChange}
          onLatitudeChange={onLatitudeChange}
          onLongitudeChange={onLongitudeChange}
          onSubmit={onSubmit}
        />
      </section>

      <section className="panel mapPanel">
        <IncidentMap incidents={incidents} onMapPick={onMapPick} />
      </section>
    </main>
  );
}
