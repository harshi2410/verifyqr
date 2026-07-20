"use client";

import { useAuth } from "@/context/AuthContext";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function VerifyButton({
  onVerified,
}: {
  onVerified: (newCount: number) => void;
}) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  async function verify() {
    if (!session?.access_token) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const payload = (await response.json()) as { count?: number; error?: string };

      if (!response.ok || typeof payload.count !== "number") {
        throw new Error(payload.error ?? "Unable to verify.");
      }

      setVerified(true);
      onVerified(payload.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className={`button ${verified ? "success" : ""}`}
        disabled={loading || verified}
        onClick={verify}
        type="button"
      >
        {loading ? <Loader2 size={18} /> : verified ? <Check size={18} /> : <ShieldCheck size={18} />}
        {loading ? "Verifying..." : verified ? "Verified Successfully" : "VERIFY"}
      </button>
      {error ? <p className="error" style={{ marginTop: 14 }}>{error}</p> : null}
      {verified ? <p className="success-text">Scan logged and count updated.</p> : null}
    </div>
  );
}
