import { createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const masterQr = process.env.MASTER_QR;

  if (!token) {
    return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
  }

  if (!masterQr) {
    return NextResponse.json({ error: "MASTER_QR is not configured on the server." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { qrValue?: string } | null;
  const qrValue = body?.qrValue?.trim();

  if (!qrValue) {
    return NextResponse.json({ error: "No QR value was received." }, { status: 400 });
  }

  if (qrValue !== masterQr.trim()) {
    return NextResponse.json({ error: "Invalid QR", valid: false }, { status: 400 });
  }

  const supabase = createServerSupabase(token);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Please log in again." }, { status: 401 });
  }

  const { error: insertError } = await supabase.from("scan_logs").insert({
    verified_by: user.id,
    user_email: user.email,
    source: "qr_camera",
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { count, error: countError } = await supabase
    .from("scan_logs")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0, valid: true });
}
