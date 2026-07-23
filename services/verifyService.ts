import { supabase } from "@/lib/supabase/client";
import { detectFraud } from "@/services/fraudService";

export async function verifyScan(qrValue: string) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("scan_logs")
    .insert({
      qr_value: qrValue,
      verified_by: user?.id,
      user_email: user?.email,
      source: "Scanner",
    });

  if (error) throw error;

  const fraud = await detectFraud(qrValue);

  const { count } = await supabase
    .from("scan_logs")
    .select("*", {
      count: "exact",
      head: true,
    });

  return {
    count: count ?? 0,
    fraud,
  };
}