'use client';

import { ParsedRow } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function ChartPanel({ rows, mode, hasSymbol }: { rows: ParsedRow[]; mode: 'close' | 'day_change'; hasSymbol: boolean }) {
  const prepared = rows
    .slice()
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((r) => ({ ...r, aggregate: r.day_change }));

  return (
    <motion.div className="glass p-4" initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Trend Explorer</h3>
      </div>
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={prepared}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe6ff" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dbe6ff' }} />
            <Legend />
            {hasSymbol ? (
              mode === 'close' ? (
                <>
                  <Line type="monotone" dataKey="close" stroke="#7c8cff" strokeWidth={2.5} dot={false} animationDuration={500} />
                  <Line type="monotone" dataKey="prev_close" stroke="#8fd3c7" strokeWidth={2.5} dot={false} animationDuration={500} />
                </>
              ) : (
                <Line type="monotone" dataKey="day_change" stroke="#b388ff" strokeWidth={2.5} dot={false} animationDuration={500} />
              )
            ) : (
              <Line type="monotone" dataKey="aggregate" stroke="#6e93ff" strokeWidth={2.5} dot={false} animationDuration={500} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
