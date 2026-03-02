export default function StatsCards({ total, high }) {
  return (
    <div className="stats">
      <article>
        <p>Total incidents</p>
        <strong>{total}</strong>
      </article>
      <article>
        <p>High + Critical</p>
        <strong>{high}</strong>
      </article>
    </div>
  );
}
