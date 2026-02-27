'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Calculator, Layers3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/holdings-summary', label: 'Holdings Summary', icon: Layers3 },
  { href: '/allocation-calculator', label: 'Allocation Calculator', icon: Calculator },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-4 p-4 sm:p-6">
      <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col p-4 lg:flex">
        <h1 className="mb-6 text-lg font-semibold text-slate-700">Portfolio Pulse</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <motion.div key={item.href} whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    active
                      ? 'border-indigo-200 bg-white/85 text-indigo-700 shadow'
                      : 'border-transparent text-slate-600 hover:border-white/40 hover:bg-white/65 hover:shadow'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>
      <main className="w-full">
        <div className="mb-4 flex gap-2 overflow-auto lg:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm ${active ? 'bg-indigo-600 text-white' : 'glass text-slate-700'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {children}
      </main>
    </div>
  );
}
