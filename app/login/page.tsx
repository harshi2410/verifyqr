'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import '@/styles/landing.css';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/scanner');
    }
  }, [user, router]);

  return (
    <div className="landing-page">
      <button 
        className="login-back-btn" 
        onClick={() => router.push('/')}
      >
        &larr; Back
      </button>
      <LoginForm />
    </div>
  );
}
