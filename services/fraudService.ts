import { supabase } from "@/lib/supabase/client";
import type { FraudLog, FraudSeverity } from "@/types/scan";

export async function detectFraud(qrValue: string) {
  const since = new Date(Date.now() - 30_000).toISOString();
  const { count, error } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true })
    .eq("qr_value", qrValue)
    .gte("created_at", since);

  if (error) throw error;

  const scanCount = count ?? 0;
  if (scanCount <= 5) {
    return { severity: "normal" as FraudSeverity, scanCount };
  }

  const severity: FraudSeverity = scanCount > 10 ? "critical" : "warning";
  const reason = `Same QR verified ${scanCount} times within 30 seconds.`;
  const { error: fraudError } = await supabase.from("fraud_logs").insert({
    qr_value: qrValue,
    reason,
    severity,
    scan_count: scanCount,
  });

  if (fraudError) throw fraudError;

  return { severity, scanCount, reason };
}

export async function getRecentFraudLogs(limit = 20) {
  const { data, error } = await supabase
    .from("fraud_logs")
    .select("id, created_at, reason, severity, qr_value, scan_count")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as FraudLog[];
}
