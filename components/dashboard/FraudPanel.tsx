import { formatDateTime } from "@/lib/utils";
import type { FraudLog } from "@/types/scan";
import { ShieldAlert } from "lucide-react";

export function FraudPanel({
  status,
  fraudLogs,
}: {
  status: string;
  fraudLogs: FraudLog[];
}) {
  return (
    <section className="dashboard-panel">

      <div className="panel-header">

        <div className="panel-title">

          <ShieldAlert size={22} />

          <h2>Fraud Detection</h2>

        </div>

        <span className={`status-pill ${status.toLowerCase()}`}>
          {status}
        </span>

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

            {fraudLogs.length === 0 ? (

              <tr>

                <td colSpan={4} className="muted">

                  No suspicious activity detected.

                </td>

              </tr>

            ) : (

              fraudLogs.map((log) => (

                <tr key={log.id}>

                  <td>{formatDateTime(log.created_at)}</td>

                  <td>

                    <span
                      className={`status-pill ${log.severity.toLowerCase()}`}
                    >
                      {log.severity}
                    </span>

                  </td>

                  <td>{log.reason}</td>

                  <td>{log.scan_count}</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}