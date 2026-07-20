"use client";

import { ExportButton } from "@/components/ExportButton";
import { DailyReport } from "@/components/dashboard/DailyReport";
import { FraudPanel } from "@/components/dashboard/FraudPanel";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProtectedShell } from "@/components/Navbar";
import { getRecentFraudLogs } from "@/services/fraudService";
import { buildDailyReport, getFraudStatus, getStartOfToday, getStartOfWeek } from "@/services/reportService";
import { getRecentScans, getScanCount, getScansSince } from "@/services/scanService";
import type { FraudLog, ScanLog } from "@/types/scan";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [todayScans, setTodayScans] = useState<ScanLog[]>([]);
  const [weekScans, setWeekScans] = useState<ScanLog[]>([]);
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextCount, nextScans, nextTodayScans, nextWeekScans, nextFraudLogs] = await Promise.all([
        getScanCount(),
        getRecentScans(20),
        getScansSince(getStartOfToday()),
        getScansSince(getStartOfWeek()),
        getRecentFraudLogs(20),
      ]);
      setCount(nextCount);
      setScans(nextScans);
      setTodayScans(nextTodayScans);
      setWeekScans(nextWeekScans);
      setFraudLogs(nextFraudLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const latestScan = scans[0] ? new Date(scans[0].created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "None";
  const fraudStatus = getFraudStatus(fraudLogs);
  const dailyReport = buildDailyReport(todayScans, fraudLogs);

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
        <StatsCard label="Today's Verifications" value={loading ? "..." : todayScans.length} />
        <StatsCard label="This Week" value={loading ? "..." : weekScans.length} />
      </div>
      <div className="grid analytics-grid">
        <StatsCard label="Latest Scan" value={loading ? "..." : latestScan} />
        <StatsCard label="Fraud Status" value={loading ? "..." : fraudStatus} />
        <StatsCard label="CSV Export" value="Ready" />
      </div>
      <DailyReport report={dailyReport} />
      <FraudPanel status={fraudStatus} fraudLogs={fraudLogs} />
      <RecentScans scans={scans} />
    </ProtectedShell>
  );
}
