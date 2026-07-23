'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace("/scanner");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={onSubmit}>
      <div className="login-form-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <h2>Admin Login</h2>
      <p className="login-form-subtitle">Enter your credentials to continue</p>
      
      {error ? <p className="error">{error}</p> : null}
      
      <div className="login-field">
        <label>Email</label>
        <input
          className="login-input"
          autoComplete="email"
          required
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      
      <div className="login-field">
        <label>Password</label>
        <input
          className="login-input"
          autoComplete="current-password"
          required
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      
      <button className="login-submit-btn" disabled={loading} type="submit">
        {loading ? (
          <>
            Signing in...
            <span className="login-spinner"></span>
          </>
        ) : (
          "Sign In \u2192"
        )}
      </button>
    </form>
  );
}
