export function StatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <section className="panel">
      <div className="muted">{label}</div>
      <div className="stat-value">{value}</div>
    </section>
  );
}
