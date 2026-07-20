import type { FraudLog, ScanLog } from "@/types/scan";

export function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getStartOfWeek() {
  const today = getStartOfToday();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - diff);
}

export function buildDailyReport(scans: ScanLog[], fraudLogs: FraudLog[]) {
  const hourlyCounts = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));

  scans.forEach((scan) => {
    hourlyCounts[new Date(scan.created_at).getHours()].count += 1;
  });

  const peak = hourlyCounts.reduce((best, item) => (item.count > best.count ? item : best), hourlyCounts[0]);
  const activeHours = hourlyCounts.filter((item) => item.count > 0).length || 1;

  return {
    todayTotal: scans.length,
    peakHour: `${String(peak.hour).padStart(2, "0")}:00`,
    scansPerHour: hourlyCounts,
    fraudAlerts: fraudLogs.length,
    averageScansPerHour: Math.round((scans.length / activeHours) * 10) / 10,
  };
}

export function getFraudStatus(fraudLogs: FraudLog[]) {
  if (fraudLogs.some((log) => log.severity === "critical")) return "Critical";
  if (fraudLogs.some((log) => log.severity === "warning")) return "Warning";
  return "Normal";
}
