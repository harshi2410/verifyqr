import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VerifyQR",
  description: "Professional QR verification scanner",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VerifyQR",
  },
  themeColor: "#071114",
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
