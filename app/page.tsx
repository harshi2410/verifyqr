'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import '@/styles/landing.css';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="landing-page">
      <div className="landing-particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="landing-card">
        <div className="landing-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M12 12h.01" />
          </svg>
        </div>
        <h1 className="landing-title">VerifyQR</h1>
        <p className="landing-subtitle">Secure QR Verification Platform</p>
        
        {user ? (
          <button 
            className="landing-btn" 
            onClick={() => router.push('/scanner')}
          >
            Go to Scanner &rarr;
          </button>
        ) : (
          <button 
            className="landing-btn" 
            onClick={() => router.push('/login')}
          >
            Admin Login
          </button>
        )}
        
        <p className="landing-footer">Scan the Master QR to access this portal.</p>
      </div>
    </div>
  );
}