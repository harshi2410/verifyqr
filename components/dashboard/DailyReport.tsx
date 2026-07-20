import type { buildDailyReport } from "@/services/reportService";

type DailyReportData = ReturnType<typeof buildDailyReport>;

export function DailyReport({ report }: { report: DailyReportData }) {
  const maxCount = Math.max(...report.scansPerHour.map((item) => item.count), 1);

  return (
    <section className="panel analytics-panel">
      <div className="section-heading">
        <h2>Daily Report</h2>
        <span className="muted">Today</span>
      </div>
      <div className="report-grid">
        <div>
          <span>Today&apos;s Total</span>
          <strong>{report.todayTotal}</strong>
        </div>
        <div>
          <span>Peak Hour</span>
          <strong>{report.peakHour}</strong>
        </div>
        <div>
          <span>Fraud Alerts</span>
          <strong>{report.fraudAlerts}</strong>
        </div>
        <div>
          <span>Avg Scans/Hour</span>
          <strong>{report.averageScansPerHour}</strong>
        </div>
      </div>
      <div className="hour-chart" aria-label="Scans per hour">
        {report.scansPerHour.map((item) => (
          <div className="hour-bar" key={item.hour}>
            <span style={{ height: `${Math.max(6, (item.count / maxCount) * 100)}%` }} />
            <small>{item.hour % 6 === 0 ? item.hour : ""}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
