export default function ReportForm({
  description,
  latitude,
  longitude,
  submitting,
  status,
  onDescriptionChange,
  onLatitudeChange,
  onLongitudeChange,
  onSubmit,
}) {
  return (
    <form className="stack" onSubmit={onSubmit}>
      <h2>Report Incident</h2>
      <textarea
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Describe what happened"
        rows={5}
      />
      <div className="row">
        <input
          type="text"
          value={latitude}
          onChange={(event) => onLatitudeChange(event.target.value)}
          placeholder="Latitude"
        />
        <input
          type="text"
          value={longitude}
          onChange={(event) => onLongitudeChange(event.target.value)}
          placeholder="Longitude"
        />
      </div>
      <button disabled={submitting} type="submit">
        {submitting ? "Submitting..." : "Submit Incident"}
      </button>
      {status ? <p className="status">{status}</p> : null}
    </form>
  );
}
