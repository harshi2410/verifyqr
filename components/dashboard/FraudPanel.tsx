import { formatDateTime } from "@/lib/utils";
import type { FraudLog } from "@/types/scan";

export function FraudPanel({ status, fraudLogs }: { status: string; fraudLogs: FraudLog[] }) {
  return (
    <section className="panel analytics-panel">
      <div className="section-heading">
        <h2>AI Fraud Detection</h2>
        <span className={`status-pill ${status.toLowerCase()}`}>{status}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Severity</th>
              <th>Reason</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {fraudLogs.map((log) => (
              <tr key={log.id}>
                <td>{formatDateTime(log.created_at)}</td>
                <td>{log.severity}</td>
                <td>{log.reason}</td>
                <td>{log.scan_count}</td>
              </tr>
            ))}
            {fraudLogs.length === 0 ? (
              <tr>
                <td className="muted" colSpan={4}>
                  No suspicious activity detected.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
