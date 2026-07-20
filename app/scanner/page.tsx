"use client";

import { ProtectedShell } from "@/components/Navbar";
import { QRScanner } from "@/components/scanner/QRScanner";
import { getScanCount } from "@/services/scanService";
import { useCallback, useEffect, useState } from "react";

export default function ScannerPage() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const handleCountChange = useCallback((nextCount: number) => {
    setCount(nextCount);
  }, []);

  useEffect(() => {
    getScanCount()
      .then(setCount)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load count."));
  }, []);

  return (
    <ProtectedShell fullScreen>
      {error ? <p className="error">{error}</p> : <QRScanner count={count} onCountChange={handleCountChange} />}
    </ProtectedShell>
  );
}
