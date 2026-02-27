import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { PageTransition } from '@/components/page-transition';

export const metadata: Metadata = {
  title: 'Portfolio Pulse Dashboard',
  description: 'Soft-fintech glass dashboard for portfolio change analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>
      </body>
    </html>
  );
}
