import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { format, parse, parseISO, isValid } from 'date-fns';
import { z } from 'zod';
import { ParsedRow, UploadError } from './types';

const requiredColumns = ['date', 'symbol', 'close'] as const;

const preprocessRow = z.object({
  date: z.string().min(1),
  symbol: z.string().min(1),
  close: z.coerce.number(),
  prev_close: z.coerce.number().optional(),
  open: z.coerce.number().optional(),
  day_change: z.coerce.number().optional(),
  day_change_pct: z.coerce.number().optional(),
});

const normalizeHeader = (header: string) =>
  header.toLowerCase().trim().replace(/\s+/g, '_');

const parseDateInput = (value: string): string | null => {
  const trimmed = value.trim();
  const formats = ['yyyy-MM-dd', 'dd-MM-yyyy', 'MM/dd/yyyy', 'dd/MM/yyyy'];

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = parseISO(trimmed);
    if (isValid(parsed)) {
      return format(parsed, 'yyyy-MM-dd');
    }
  }

  for (const f of formats) {
    const parsed = parse(trimmed, f, new Date());
    if (isValid(parsed)) {
      return format(parsed, 'yyyy-MM-dd');
    }
  }
  return null;
};

const normalizeRow = (raw: Record<string, unknown>, index: number): ParsedRow | UploadError => {
  const normalized = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [normalizeHeader(k), typeof v === 'string' ? v.trim() : v]),
  );

  const parsed = preprocessRow.safeParse(normalized);
  if (!parsed.success) {
    return { rowIndex: index, message: parsed.error.issues[0]?.message ?? 'Invalid row shape' };
  }

  const row = parsed.data;
  const isoDate = parseDateInput(row.date);
  if (!isoDate) {
    return { rowIndex: index, message: 'Invalid date format' };
  }

  const prevClose = row.prev_close ?? row.open;
  if (prevClose === undefined || Number.isNaN(prevClose)) {
    return { rowIndex: index, message: 'Missing prev_close/open value' };
  }

  const dayChange = row.day_change ?? row.close - prevClose;
  const dayChangePct = row.day_change_pct ?? ((row.close - prevClose) / prevClose) * 100;

  return {
    id: `${row.symbol}-${isoDate}-${index}`,
    date: isoDate,
    symbol: row.symbol.toUpperCase(),
    close: Number(row.close),
    prev_close: Number(prevClose),
    day_change: Number(dayChange),
    day_change_pct: Number(dayChangePct),
  };
};

export const parseFileData = async (file: File): Promise<{ rows: ParsedRow[]; errors: UploadError[] }> => {
  const fileName = file.name.toLowerCase();

  let rawRows: Record<string, unknown>[] = [];
  if (fileName.endsWith('.csv')) {
    rawRows = await new Promise((resolve, reject) => {
      Papa.parse<Record<string, unknown>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => resolve(result.data),
        error: reject,
      });
    });
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheet], {
      defval: '',
    });
  } else {
    return { rows: [], errors: [{ message: 'Unsupported file format. Use CSV, XLSX or XLS.' }] };
  }

  const headers = rawRows[0] ? Object.keys(rawRows[0]).map(normalizeHeader) : [];
  const missingRequired = requiredColumns.filter((col) => !headers.includes(col));
  if (missingRequired.length > 0) {
    return { rows: [], errors: [{ message: `Missing required columns: ${missingRequired.join(', ')}` }] };
  }

  const rows: ParsedRow[] = [];
  const errors: UploadError[] = [];

  rawRows.forEach((raw, idx) => {
    const result = normalizeRow(raw, idx + 1);
    if ('id' in result) {
      rows.push(result);
    } else {
      errors.push(result);
    }
  });

  return {
    rows: rows.sort((a, b) => (a.date < b.date ? 1 : -1)),
    errors,
  };
};
