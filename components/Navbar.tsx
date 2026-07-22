"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedShell({
  children,
  fullScreen = false,
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
}) {
  const { loading, session, user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="login-wrap">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session) return null;

  // ---------- Scanner Layout ----------
  if (fullScreen) {
    return (
      <main className="scanner-layout">
        <header className="scanner-topbar">
          <div className="scanner-brand">
            <ShieldCheck size={28} />
            <div>
              <h1>VerifyQR Scanner</h1>
              <span>Secure QR Verification</span>
            </div>
          </div>

          <div className="scanner-user">
            <div>
              <div className="online-indicator">
                <span className="online-dot" />
                Online
              </div>

              <p>{user?.email}</p>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </header>

        <section className="scanner-content">
          {children}
        </section>
      </main>
    );
  }

  // ---------- Dashboard Layout ----------
  return (
    <div className="app-shell">
      {children}
    </div>
  );
}