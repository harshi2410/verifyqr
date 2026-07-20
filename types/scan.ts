export type ScanLog = {
  id: string;
  created_at: string;
  verified_by: string | null;
  user_email: string | null;
  source: string;
  qr_value: string | null;
};

export type FraudSeverity = "normal" | "warning" | "critical";

export type FraudLog = {
  id: string;
  created_at: string;
  reason: string;
  severity: FraudSeverity;
  qr_value: string | null;
  scan_count: number;
};
