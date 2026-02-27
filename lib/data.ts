import { ParsedRow, QuickRange } from './types';
import { subMonths, subWeeks, startOfYear, format } from 'date-fns';

export const getSymbols = (rows: ParsedRow[]) => Array.from(new Set(rows.map((row) => row.symbol))).sort();

export const filterRows = (
  rows: ParsedRow[],
  symbol?: string,
  start?: string,
  end?: string,
): ParsedRow[] => {
  return rows.filter((row) => {
    const symbolMatch = symbol ? row.symbol === symbol : true;
    const startMatch = start ? row.date >= start : true;
    const endMatch = end ? row.date <= end : true;
    return symbolMatch && startMatch && endMatch;
  });
};

export const getQuickRange = (range: QuickRange): { start?: string; end?: string } => {
  const now = new Date();
  if (range === 'ALL') return {};
  if (range === 'YTD') return { start: format(startOfYear(now), 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
  if (range === '3M') return { start: format(subMonths(now, 3), 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
  if (range === '1M') return { start: format(subMonths(now, 1), 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
  return { start: format(subWeeks(now, 1), 'yyyy-MM-dd'), end: format(now, 'yyyy-MM-dd') };
};

export const average = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
