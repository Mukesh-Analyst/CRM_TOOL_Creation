'use client';

import { useEffect, useMemo, useState } from 'react';
import { UploadCard } from '@/components/upload-card';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { DayChangeTable } from '@/components/day-change-table';
import { ChartPanel } from '@/components/chart-panel';
import { average, filterRows, getQuickRange, getSymbols } from '@/lib/data';
import { QuickRange } from '@/lib/types';

const quickRanges: QuickRange[] = ['1W', '1M', '3M', 'YTD', 'ALL'];

export default function DashboardPage() {
  const { rows, selectedSymbol, setSelectedSymbol, dateRange, setDateRange, resetFilters, chartMode, setChartMode } =
    usePortfolioStore();
  const [search, setSearch] = useState('');
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('symbol');
    if (param) setSelectedSymbol(param.toUpperCase());
  }, [setSelectedSymbol]);

  const symbols = useMemo(() => getSymbols(rows), [rows]);
  const filtered = useMemo(
    () => filterRows(rows, selectedSymbol, dateRange.start, dateRange.end).filter((row) => row.symbol.includes(search.toUpperCase())),
    [rows, selectedSymbol, dateRange.start, dateRange.end, search],
  );

  const avgClose = average(filtered.map((r) => r.close));

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_2fr]">
        <UploadCard />
        <div className="glass p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Stock</span>
              <select
                value={selectedSymbol ?? ''}
                onChange={(e) => setSelectedSymbol(e.target.value || undefined)}
                className="w-full rounded-xl border border-white/50 bg-white/70 px-3 py-2"
              >
                <option value="">All Stocks</option>
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block text-slate-600">Start</span>
              <input
                type="date"
                value={dateRange.start ?? ''}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value || undefined })}
                className="w-full rounded-xl border border-white/50 bg-white/70 px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">End</span>
              <input
                type="date"
                value={dateRange.end ?? ''}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value || undefined })}
                className="w-full rounded-xl border border-white/50 bg-white/70 px-3 py-2"
              />
            </label>

            <div className="md:col-span-2">
              <span className="mb-1 block text-sm text-slate-600">Quick range</span>
              <div className="flex flex-wrap gap-2">
                {quickRanges.map((range) => (
                  <button
                    key={range}
                    className="rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs transition hover:-translate-y-0.5 hover:shadow"
                    onClick={() => setDateRange(getQuickRange(range))}
                  >
                    {range}
                  </button>
                ))}
                <button
                  className="rounded-full border border-rose-100 bg-rose-50/80 px-3 py-1 text-xs text-rose-600"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white/80 p-3">
              <p className="text-xs text-slate-500">Avg Price</p>
              <p className="text-xl font-semibold text-indigo-700">{avgClose ? avgClose.toFixed(2) : '--'}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbol..."
              className="rounded-xl border border-white/50 bg-white/75 px-3 py-2 text-sm"
            />
            <button
              className={`rounded-xl px-3 py-2 text-sm ${
                chartMode === 'close' ? 'bg-indigo-600 text-white' : 'border border-white/50 bg-white/70'
              }`}
              onClick={() => setChartMode('close')}
            >
              Close Chart
            </button>
            <button
              className={`rounded-xl px-3 py-2 text-sm ${
                chartMode === 'day_change' ? 'bg-indigo-600 text-white' : 'border border-white/50 bg-white/70'
              }`}
              onClick={() => setChartMode('day_change')}
            >
              Day Change Chart
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DayChangeTable rows={filtered} />
        <ChartPanel rows={filtered} mode={chartMode} hasSymbol={Boolean(selectedSymbol)} />
      </section>
    </div>
  );
}
