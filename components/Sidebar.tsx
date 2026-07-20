"use client";

import { ExportButton } from "@/components/ExportButton";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Verification Portal</div>
      <nav className="sidebar-nav">
        <Link className="sidebar-link" href="/scanner">
          Verify
        </Link>
        <Link className="sidebar-link" href="/dashboard">
          Dashboard
        </Link>
      </nav>
      <div style={{ marginTop: 14 }}>
        <ExportButton variant="secondary" />
      </div>
      <p className="muted" style={{ marginTop: 28, color: "#a9b4c0", wordBreak: "break-word" }}>
        {user?.email}
      </p>
      <button className="button secondary" onClick={handleSignOut} type="button">
        Sign out
      </button>
    </aside>
  );
}
