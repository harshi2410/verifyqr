import { supabase } from "@/lib/supabase/client";

export async function verifyScan() {
  const { error } = await supabase
    .from("scan_logs")
    .insert({});

  if (error) throw error;

  const { count } = await supabase
    .from("scan_logs")
    .select("*", {
      count: "exact",
      head: true,
    });

  return count ?? 0;
}