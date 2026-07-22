'use client';

import ProtectedShell from '@/components/ui/ProtectedShell';
import QRScanner from '@/components/scanner/QRScanner';
import '@/styles/scanner.css';

export default function ScannerPage() {
  return (
    <ProtectedShell>
      <QRScanner />
    </ProtectedShell>
  );
}
