"use client";

import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/scanner");
    }
  }, [loading, router, session]);

  return (
    <main className="login-wrap">
      <section className="panel login-card">
        <h1 className="page-title">Admin Login</h1>
        <LoginForm />
      </section>
    </main>
  );
}
