'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import '@/styles/landing.css';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/scanner');
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  return (
    <div className="landing-page">
      <button
        className="login-back-btn"
        onClick={() => router.push('/')}
      >
        ← Back
      </button>

      <LoginForm />
    </div>
  );
}