'use client';

import { ParsedRow } from '@/lib/types';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const formatNum = (n: number) => n.toFixed(2);

export function DayChangeTable({ rows }: { rows: ParsedRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

  const columns = useMemo<ColumnDef<ParsedRow>[]>(
    () => [
      { accessorKey: 'date', header: 'Date' },
      { accessorKey: 'symbol', header: 'Symbol' },
      { accessorKey: 'prev_close', header: 'Prev Close', cell: ({ row }) => formatNum(row.original.prev_close) },
      { accessorKey: 'close', header: 'Close', cell: ({ row }) => formatNum(row.original.close) },
      {
        accessorKey: 'day_change',
        header: 'Day Change',
        cell: ({ row }) => (
          <span className={row.original.day_change >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
            {formatNum(row.original.day_change)}
          </span>
        ),
      },
      {
        accessorKey: 'day_change_pct',
        header: 'Day Change %',
        cell: ({ row }) => (
          <span className={row.original.day_change_pct >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
            {formatNum(row.original.day_change_pct)}%
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  return (
    <div className="glass p-4">
      <div className="max-h-[520px] overflow-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer px-3 py-2 text-left font-medium text-slate-600"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-white/50 transition hover:bg-indigo-50/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-xs">
        <button
          className="rounded-lg border px-2 py-1 disabled:opacity-40"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <button
          className="rounded-lg border px-2 py-1 disabled:opacity-40"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
