"use client";

import { formatDateTime } from "@/lib/utils";
import type { ScanLog } from "@/types/scan";

export function RecentScans({ scans }: { scans: ScanLog[] }) {
  return (
    <section className="panel" style={{ marginTop: 16 }}>
      <h2 style={{ marginTop: 0 }}>Verification History</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Admin</th>
              <th>Source</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td>{formatDateTime(scan.created_at)}</td>
                <td>{scan.user_email ?? "Unknown"}</td>
                <td>{scan.source}</td>
                <td>{scan.id}</td>
              </tr>
            ))}
            {scans.length === 0 ? (
              <tr>
                <td className="muted" colSpan={4}>
                  No verifications yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
