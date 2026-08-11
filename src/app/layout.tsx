import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import AuthSessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eureka Campus Ideathon & Startup Pitching Competition | Jaypee University Anoopshahr",
  description: "Join Eureka Campus Ideathon & Startup Pitching Competition at Jaypee University Anoopshahr on 22 August 2026. Pitch radical ideas and build solutions that shape the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased selection:bg-accent-purple/30 selection:text-white`}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Toaster theme="dark" position="bottom-right" toastOptions={{
          style: {
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(12px)',
          }
        }} />
      </body>
    </html>
  );
}
