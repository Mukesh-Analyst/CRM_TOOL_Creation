'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ParsedRow, BuyLot } from '@/lib/types';

type DateRange = {
  start?: string;
  end?: string;
};

type PortfolioState = {
  rows: ParsedRow[];
  selectedSymbol?: string;
  dateRange: DateRange;
  chartMode: 'close' | 'day_change';
  holdingsBySymbol: Record<string, number>;
  buyLotsBySymbol: Record<string, BuyLot[]>;
  setRows: (rows: ParsedRow[]) => void;
  setSelectedSymbol: (symbol?: string) => void;
  setDateRange: (dateRange: DateRange) => void;
  resetFilters: () => void;
  setChartMode: (mode: 'close' | 'day_change') => void;
  setHoldings: (symbol: string, qty: number) => void;
  setBuyLots: (symbol: string, lots: BuyLot[]) => void;
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      rows: [],
      dateRange: {},
      chartMode: 'close',
      holdingsBySymbol: {},
      buyLotsBySymbol: {},
      setRows: (rows) => set({ rows }),
      setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
      setDateRange: (dateRange) => set({ dateRange }),
      resetFilters: () => set({ selectedSymbol: undefined, dateRange: {} }),
      setChartMode: (chartMode) => set({ chartMode }),
      setHoldings: (symbol, qty) =>
        set((state) => ({
          holdingsBySymbol: { ...state.holdingsBySymbol, [symbol]: qty },
        })),
      setBuyLots: (symbol, lots) =>
        set((state) => ({
          buyLotsBySymbol: { ...state.buyLotsBySymbol, [symbol]: lots },
        })),
    }),
    {
      name: 'portfolio-store-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
