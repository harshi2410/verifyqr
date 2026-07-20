"use client";

import { ExportButton } from "@/components/ExportButton";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProtectedShell } from "@/components/Navbar";
import { getRecentScans, getScanCount } from "@/services/scanService";
import type { ScanLog } from "@/types/scan";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextCount, nextScans] = await Promise.all([getScanCount(), getRecentScans(50)]);
      setCount(nextCount);
      setScans(nextScans);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const todayCount = scans.filter((scan) => {
    const scanDate = new Date(scan.created_at);
    const now = new Date();
    return scanDate.toDateString() === now.toDateString();
  }).length;
  const lastHourCount = scans.filter((scan) => Date.now() - new Date(scan.created_at).getTime() <= 60 * 60 * 1000).length;
  const latestScan = scans[0] ? new Date(scans[0].created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "None";

  return (
    <ProtectedShell>
      <div className="topbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="muted">Verification totals and recent scan history.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="button secondary" onClick={load} type="button">
            <RefreshCw size={18} />
            Refresh
          </button>
          <ExportButton />
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}
      <div className="grid">
        <StatsCard label="Total Verifications" value={loading ? "..." : count} />
        <StatsCard label="Today" value={loading ? "..." : todayCount} />
        <StatsCard label="Last Hour" value={loading ? "..." : lastHourCount} />
      </div>
      <div className="grid analytics-grid">
        <StatsCard label="History Loaded" value={loading ? "..." : scans.length} />
        <StatsCard label="Latest Scan" value={loading ? "..." : latestScan} />
        <StatsCard label="CSV Export" value="Ready" />
      </div>
      <RecentScans scans={scans} />
    </ProtectedShell>
  );
}
