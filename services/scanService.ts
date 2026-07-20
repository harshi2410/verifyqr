import { supabase } from "@/lib/supabase/client";
import type { ScanLog } from "@/types/scan";

export async function getScanCount() {
  const { count, error } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function getRecentScans(limit = 25) {
  const { data, error } = await supabase
    .from("scan_logs")
    .select("id, created_at, verified_by, user_email, source, qr_value")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ScanLog[];
}

export async function getScansSince(start: Date) {
  const { data, error } = await supabase
    .from("scan_logs")
    .select("id, created_at, verified_by, user_email, source, qr_value")
    .gte("created_at", start.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ScanLog[];
}
