"use client";

import { APP_NAME, MASTER_QR } from "@/config/constants";
import { verifyScan } from "@/services/verifyService";
import { CheckCircle2, Loader2, QrCode, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

type BarcodeResult = {
  rawValue: string;
};

type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<BarcodeResult[]>;
};

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
    webkitAudioContext?: typeof AudioContext;
  }
}

type ScanState = "ready" | "processing" | "verified" | "invalid" | "error" | "warning" | "critical";

function playTone(kind: "success" | "error") {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(kind === "success" ? 880 : 180, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.24);
}

function playSound(kind: "success" | "error") {
  const audio = new Audio(kind === "success" ? "/success.mp3" : "/error.mp3");
  audio.play().catch(() => playTone(kind));
}

export function QRScanner({ count, onCountChange }: { count: number | null; onCountChange: (count: number) => void }) {
  const lastVisibleQrRef = useRef<string | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [state, setState] = useState<ScanState>("ready");
  const [message, setMessage] = useState("Point the camera at the master QR.");

  function showFeedback(nextState: ScanState, nextMessage: string) {
    setState(nextState);
    setMessage(nextMessage);

    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setState("ready");
      setMessage("Ready for next ticket.");
    }, 1000);
  }

    async function verifyQr(value: string) {
      if (value !== MASTER_QR) {
        playSound("error");
        showFeedback("invalid", "INVALID QR");
        return;
      }

      setState("processing");
      setMessage("Checking QR...");

      try {
        const result = await verifyScan(value);
        const messages = {normal: "VERIFIED",
                          warning: "WARNING",
                          critical: "FRAUD DETECTED"};
        onCountChange(result.count);
        playSound("success");
        navigator.vibrate?.(200);
        showFeedback(result.fraud.severity === "normal" ? "verified" : result.fraud.severity,  messages[result.fraud.severity]);
      } catch (err) {
        playSound("error");
        showFeedback("error", err instanceof Error ? err.message : "Verification failed.");
      }
    }


  return (
    <section className="scanner-screen">
      <header className="scanner-header">
        <div>
          <p className="app-kicker">{APP_NAME}</p>
          <h1>Scanner</h1>
        </div>
        <div className="scanner-total">
          <span>Total Verified</span>
          <strong>{count ?? "--"}</strong>
        </div>
      </header>

      <div className="camera-frame">
        <Scanner
    constraints={{
        facingMode: "environment"
    }}
    onScan={(results)=>{

        if(!results.length){
            lastVisibleQrRef.current=null;
            return;
        }

        const value=results[0].rawValue;

        if(value===lastVisibleQrRef.current){
            return;
        }

        lastVisibleQrRef.current=value;

        verifyQr(value);

    }}
    onError={(error)=>{

        setState("error");
        setMessage(error?.message ?? "Unable to access camera.");

    }}
    classNames={{
        container:"camera-video"
    }}
/>
        <div className={`scan-overlay ${state}`} />
        <div className={`scan-feedback ${state}`}>
          {state === "processing" ? <Loader2 size={72} /> : state === "verified" || state === "warning" || state === "critical" ? <CheckCircle2 size={86} /> : state === "invalid" || state === "error" ? <XCircle size={86} /> : <QrCode size={40} />}
          {message}
        </div>
      </div>

      <footer className="scanner-status">
        <span>Last Scan Status</span>
        <strong>{message}</strong>
      </footer>
    </section>
  );
}
