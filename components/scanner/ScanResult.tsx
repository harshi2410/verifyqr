'use client';

interface Props {
  type: 'success' | 'error';
}

export default function ScanResult({ type }: Props) {
  return (
    <div className={`scan-overlay scan-overlay-${type}`}>
      <div className="scan-overlay-content">
        {type === 'success' ? (
          <>
            <div className="scan-overlay-icon scan-overlay-success-icon">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="34" stroke="#22c55e" strokeWidth="3" opacity="0.3" />
                <circle cx="36" cy="36" r="34" stroke="#22c55e" strokeWidth="3" 
                  strokeDasharray="214" strokeDashoffset="214"
                  className="scan-overlay-circle" />
                <path d="M22 36l10 10 18-20" stroke="#22c55e" strokeWidth="3.5" 
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="50" strokeDashoffset="50"
                  className="scan-overlay-check" />
              </svg>
            </div>
            <p className="scan-overlay-text scan-overlay-text-success">VERIFIED</p>
            <p className="scan-overlay-subtext">QR code authenticated successfully</p>
          </>
        ) : (
          <>
            <div className="scan-overlay-icon scan-overlay-error-icon">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="34" stroke="#ef4444" strokeWidth="3" opacity="0.3" />
                <circle cx="36" cy="36" r="34" stroke="#ef4444" strokeWidth="3" 
                  strokeDasharray="214" strokeDashoffset="214"
                  className="scan-overlay-circle" />
                <path d="M26 26l20 20M46 26l-20 20" stroke="#ef4444" strokeWidth="3.5" 
                  strokeLinecap="round"
                  strokeDasharray="30" strokeDashoffset="30"
                  className="scan-overlay-x" />
              </svg>
            </div>
            <p className="scan-overlay-text scan-overlay-text-error">INVALID QR</p>
            <p className="scan-overlay-subtext">This QR code could not be verified</p>
          </>
        )}
      </div>
    </div>
  );
}
