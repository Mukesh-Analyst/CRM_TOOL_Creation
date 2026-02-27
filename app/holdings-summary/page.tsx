'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { average } from '@/lib/data';

export default function HoldingsSummaryPage() {
  const rows = usePortfolioStore((s) => s.rows);

  const summary = useMemo(() => {
    const map = new Map<string, typeof rows>();
    rows.forEach((row) => {
      const existing = map.get(row.symbol) ?? [];
      existing.push(row);
      map.set(row.symbol, existing);
    });

    return Array.from(map.entries()).map(([symbol, list]) => {
      const sorted = list.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
      const latest = sorted[0];
      const closes = list.map((r) => r.close);
      return {
        symbol,
        records: list.length,
        latest_close: latest?.close ?? 0,
        latest_day_change_pct: latest?.day_change_pct ?? 0,
        avg_close: average(closes),
        min_close: Math.min(...closes),
        max_close: Math.max(...closes),
      };
    });
  }, [rows]);

  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="glass p-5">
          <p className="text-xs text-slate-500">Distinct Stocks</p>
          <p className="text-2xl font-semibold text-indigo-700">{summary.length}</p>
        </div>
        <div className="glass p-5">
          <p className="text-xs text-slate-500">Total Rows</p>
          <p className="text-2xl font-semibold text-indigo-700">{rows.length}</p>
        </div>
      </section>
      <section className="glass overflow-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="p-2">Symbol</th>
              <th className="p-2">Records</th>
              <th className="p-2">Latest Close</th>
              <th className="p-2">Latest Day Change %</th>
              <th className="p-2">Avg Close</th>
              <th className="p-2">Min/Max</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item) => (
              <tr key={item.symbol} className="border-t border-white/60 transition hover:bg-indigo-50/40">
                <td className="p-2 font-medium text-indigo-700">
                  <Link href={`/dashboard?symbol=${item.symbol}`} className="hover:underline">
                    {item.symbol}
                  </Link>
                </td>
                <td className="p-2">{item.records}</td>
                <td className="p-2">{item.latest_close.toFixed(2)}</td>
                <td className={`p-2 ${item.latest_day_change_pct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {item.latest_day_change_pct.toFixed(2)}%
                </td>
                <td className="p-2">{item.avg_close.toFixed(2)}</td>
                <td className="p-2">{item.min_close.toFixed(2)} / {item.max_close.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
