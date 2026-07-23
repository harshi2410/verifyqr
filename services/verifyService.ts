import { supabase } from "@/lib/supabase/client";
import { detectFraud } from "@/services/fraudService";

export async function verifyScan(qrValue: string) {
  console.log("verifyScan called with:", qrValue);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👤 Current User:", user);

  const { error } = await supabase
    .from("scan_logs")
    .insert({
      qr_value: qrValue,
      verified_by: user?.id,
      user_email: user?.email,
      source: "Scanner",
    });

  if (error) {
    console.error("Insert Error:", error);
    throw error;
  }

  console.log(" Scan inserted successfully");

  const fraud = await detectFraud(qrValue);

  console.log("Fraud Result:", fraud);

  const { count, error: countError } = await supabase
    .from("scan_logs")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (countError) {
    console.error("Count Error:", countError);
    throw countError;
  }

  console.log(" Total Count:", count);

  return {
    count: count ?? 0,
    fraud,
  };
}