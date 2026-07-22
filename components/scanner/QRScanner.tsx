"use client";

import { APP_NAME, MASTER_QR } from "@/config/constants";
import { verifyScan } from "@/services/verifyService";
import { CheckCircle2, Loader2, QrCode, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

type BarcodeResult = {
  rawValue: string;
};

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<BarcodeResult[]>;
};

type BarcodeDetectorConstructor = new (
  options?: { formats?: string[] }
) => BarcodeDetectorLike;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
    webkitAudioContext?: typeof AudioContext;
  }
}

type ScanState =
  | "ready"
  | "processing"
  | "verified"
  | "invalid"
  | "error"
  | "warning"
  | "critical";

function playTone(kind: "success" | "error") {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    kind === "success" ? 880 : 180,
    now
  );

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.24);
}

function playSound(kind: "success" | "error") {
  const audio = new Audio(
    kind === "success" ? "/success.mp3" : "/error.mp3"
  );

  audio.play().catch(() => playTone(kind));
}

export function QRScanner({
  count,
  onCountChange,
}: {
  count: number | null;
  onCountChange: (count: number) => void;
}) {
  const lastVisibleQrRef = useRef<string | null>(null);
  const processingRef = useRef(false);
  const resetTimerRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const [state, setState] = useState<ScanState>("ready");
  const [message, setMessage] = useState(
    "Point the camera at the master QR."
  );

  function showFeedback(nextState: ScanState, nextMessage: string) {
    setState(nextState);
    setMessage(nextMessage);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setState("ready");
      setMessage("Ready for next scan");

      processingRef.current = false;

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        lastVisibleQrRef.current = null;
      }, 300);
    }, 1500);
  }

  async function verifyQr(value: string) {
    if (processingRef.current) return;

    processingRef.current = true;

    if (value !== MASTER_QR) {
      playSound("error");
      showFeedback("invalid", "INVALID QR");
      return;
    }

    setState("processing");
    setMessage("Checking QR...");

    try {
      const result = await verifyScan(value);

      const messages = {
        normal: "VERIFIED",
        warning: "WARNING",
        critical: "FRAUD DETECTED",
      };

      onCountChange(result.count);

      playSound("success");

      navigator.vibrate?.(200);

      showFeedback(
        result.fraud.severity === "normal"
          ? "verified"
          : result.fraud.severity,
        messages[result.fraud.severity]
      );
    } catch (err) {
      playSound("error");

      showFeedback(
        "error",
        err instanceof Error
          ? err.message
          : "Verification failed."
      );
    }
  }

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
  <section className="scanner-screen">
    <div className="scanner-dashboard">

      {/* Camera Section */}
      <div className="camera-section">
        <div className="camera-frame">
          <Scanner
            constraints={{
              facingMode: "environment",
            }}
            onScan={(results) => {
              if (!results.length) return;

              if (processingRef.current) return;

              const value = results[0].rawValue;

              if (!value) return;

              if (value === lastVisibleQrRef.current) return;

              lastVisibleQrRef.current = value;

              verifyQr(value);
            }}
            onError={(error) => {
              setState("error");
              setMessage(error?.message ?? "Unable to access camera.");
            }}
            classNames={{
              container: "camera-video",
            }}
          />

          <div className={`scan-overlay ${state}`} />

          <div className={`scan-feedback ${state}`}>
            {state === "processing" ? (
              <Loader2 size={70} />
            ) : state === "verified" ||
              state === "warning" ||
              state === "critical" ? (
              <CheckCircle2 size={90} />
            ) : state === "invalid" ||
              state === "error" ? (
              <XCircle size={90} />
            ) : (
              <QrCode size={42} />
            )}

            <h2>{message}</h2>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="scanner-info">

        <div className="info-card">
          <span>Total Verified</span>
          <strong>{count ?? "--"}</strong>
        </div>

        <div className={`info-card status ${state}`}>
          <span>Scanner Status</span>
          <strong>{message}</strong>
        </div>

      </div>

    </div>
  </section>
)
}