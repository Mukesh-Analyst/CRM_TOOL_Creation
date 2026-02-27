'use client';

import { useMemo } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { average, filterRows, getSymbols } from '@/lib/data';
import { Plus, Trash2 } from 'lucide-react';

export default function AllocationCalculatorPage() {
  const {
    rows,
    selectedSymbol,
    setSelectedSymbol,
    dateRange,
    holdingsBySymbol,
    setHoldings,
    buyLotsBySymbol,
    setBuyLots,
  } = usePortfolioStore();

  const symbols = useMemo(() => getSymbols(rows), [rows]);
  const symbol = selectedSymbol ?? symbols[0];

  const filtered = useMemo(
    () => filterRows(rows, symbol, dateRange.start, dateRange.end),
    [rows, symbol, dateRange.start, dateRange.end],
  );
  const avgPrice = average(filtered.map((r) => r.close));
  const totalStocks = holdingsBySymbol[symbol] ?? 0;
  const lots = buyLotsBySymbol[symbol] ?? [];

  const baseCost = totalStocks * avgPrice;
  const lotCost = lots.reduce((sum, lot) => sum + lot.new_price * lot.new_stock_qty, 0);
  const lotQty = lots.reduce((sum, lot) => sum + lot.new_stock_qty, 0);
  const newTotalStocks = totalStocks + lotQty;
  const newTotalCost = baseCost + lotCost;
  const newAvg = newTotalStocks > 0 ? newTotalCost / newTotalStocks : 0;

  return (
    <div className="space-y-4">
      <section className="glass grid gap-3 p-5 md:grid-cols-3">
        <label>
          <span className="mb-1 block text-sm text-slate-600">Stock</span>
          <select
            value={symbol ?? ''}
            onChange={(e) => setSelectedSymbol(e.target.value || undefined)}
            className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2"
          >
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-sm text-slate-600">Avg Price (auto)</span>
          <input value={avgPrice.toFixed(2)} disabled className="w-full rounded-xl border bg-slate-50 px-3 py-2" />
        </label>
        <label>
          <span className="mb-1 block text-sm text-slate-600">Total stocks held</span>
          <input
            type="number"
            min={0}
            value={totalStocks}
            onChange={(e) => setHoldings(symbol, Number(e.target.value || 0))}
            className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2"
          />
        </label>
      </section>

      <section className="glass p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Buy Lots</h2>
          <button
            onClick={() =>
              setBuyLots(symbol, [...lots, { id: crypto.randomUUID(), new_price: avgPrice || 0, new_stock_qty: 0 }])
            }
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-sm text-indigo-700"
          >
            <Plus className="h-4 w-4" /> Add Another Buy Lot
          </button>
        </div>

        <div className="space-y-2">
          {lots.map((lot) => (
            <div key={lot.id} className="grid gap-2 rounded-2xl border border-white/60 bg-white/70 p-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="number"
                step="0.01"
                value={lot.new_price}
                onChange={(e) =>
                  setBuyLots(
                    symbol,
                    lots.map((l) => (l.id === lot.id ? { ...l, new_price: Number(e.target.value || 0) } : l)),
                  )
                }
                className="rounded-xl border border-white/60 bg-white px-3 py-2"
                placeholder="New price"
              />
              <input
                type="number"
                value={lot.new_stock_qty}
                onChange={(e) =>
                  setBuyLots(
                    symbol,
                    lots.map((l) => (l.id === lot.id ? { ...l, new_stock_qty: Number(e.target.value || 0) } : l)),
                  )
                }
                className="rounded-xl border border-white/60 bg-white px-3 py-2"
                placeholder="New qty"
              />
              <button
                onClick={() => setBuyLots(symbol, lots.filter((l) => l.id !== lot.id))}
                className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="glass grid gap-3 p-5 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Current Value" value={baseCost} />
        <Metric label="New Total Stocks" value={newTotalStocks} />
        <Metric label="New Total Cost" value={newTotalCost} />
        <Metric label="New Avg Price" value={newAvg} />
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-indigo-700">{value.toFixed(2)}</p>
    </div>
  );
}
