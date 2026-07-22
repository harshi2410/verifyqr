import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-page">
      <div className="landing-card">
        <div className="logo-circle">✓</div>

        <h1>VerifyQR</h1>

        <p className="subtitle">
          Secure QR Verification Platform
        </p>

        <p className="description">
          This application is used by authorized administrators to verify
          genuine QR codes and maintain a live verification count.
        </p>

        <Link href="/login" className="button">
          Admin Login
        </Link>

        <div className="landing-footer">
          Scan the Master QR to access this portal.
        </div>
      </div>
    </main>
  );
}