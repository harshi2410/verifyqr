"use client";

import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedShell({ children, fullScreen = false }: { children: React.ReactNode; fullScreen?: boolean }) {
  const { loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, router, session]);

  if (loading) {
    return <main className="login-wrap">Loading...</main>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`app-shell ${fullScreen ? "scanner-app-shell" : ""}`}>
      {!fullScreen ? <Sidebar /> : null}
      <main className={fullScreen ? "scanner-main" : "main"}>{children}</main>
    </div>
  );
}
