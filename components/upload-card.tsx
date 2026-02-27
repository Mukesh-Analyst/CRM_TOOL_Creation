'use client';

import { Upload, AlertCircle, FileDown } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { parseFileData } from '@/lib/parsing';
import { useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export function UploadCard() {
  const [status, setStatus] = useState<string>('Drop CSV/XLSX file to begin.');
  const setRows = usePortfolioStore((s) => s.setRows);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setStatus('Parsing file...');

    const { rows, errors } = await parseFileData(file);
    setRows(rows);

    if (rows.length === 0) {
      setStatus(errors[0]?.message ?? 'No rows found.');
      return;
    }

    setStatus(`Loaded ${rows.length} rows${errors.length ? ` with ${errors.length} warning(s)` : ''}.`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <div className="glass p-5">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition ${
          isDragActive ? 'border-indigo-400 bg-indigo-50/80' : 'border-indigo-100 bg-white/50 hover:bg-white/70'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 h-6 w-6 text-indigo-600" />
        <p className="font-medium text-slate-700">Drag & drop file, or click to browse</p>
        <p className="mt-1 text-xs text-slate-500">Supports CSV, XLSX, XLS</p>
      </div>
      <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{status}</span>
      </div>
      <a
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs text-indigo-700"
        href="/templates/day_change_template.csv"
        download
      >
        <FileDown className="h-4 w-4" /> Download sample template
      </a>
    </div>
  );
}
