# Portfolio Pulse - Soft Fintech Glass Dashboard

A modern 3-page Next.js portfolio management web app with premium animations, interactive charts, robust upload parsing, and dynamic allocation simulation.

## Features

- **Dashboard**
  - Drag & drop upload for `.csv`, `.xlsx`, `.xls`
  - Zod-based validation + smart computed fields (`day_change`, `day_change_pct`)
  - Filters: symbol, date range, quick presets (`1W`, `1M`, `3M`, `YTD`, `ALL`)
  - Searchable + paginated day-change table
  - Recharts animated line panel (close/prev close or day change)
  - Avg price metric card (feeds calculator logic)
- **Holdings Summary**
  - Distinct stock KPIs + summary table
  - Click symbol to jump back to dashboard with preselected symbol
- **Allocation Calculator**
  - Auto-uses symbol average price from dashboard filtering logic
  - Input held qty + add multiple buy lots
  - Live weighted-average computations
- **Modern design system**
  - Soft gradients, glass cards, micro-interactions, smooth page transitions
  - Responsive sidebar/top-tab navigation
- **Persistence**
  - Zustand global store persisted to `localStorage`

## Tech stack

- Next.js App Router + TypeScript
- TailwindCSS
- Framer Motion
- Recharts
- @tanstack/react-table
- Zustand
- xlsx + PapaParse
- react-dropzone
- zod
- lucide-react
- date-fns

## Setup

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Tailwind setup included

Already configured in:
- `tailwind.config.ts`
- `postcss.config.mjs`
- `app/globals.css`

## Supported upload formats

- `.csv`
- `.xlsx`
- `.xls`

## Required columns (case-insensitive)

- `date`
- `symbol`
- `close`

## Optional columns

- `prev_close` (or `open` fallback)
- `day_change` (computed if missing)
- `day_change_pct` (computed if missing)

> Date accepts: `YYYY-MM-DD`, `DD-MM-YYYY`, `MM/DD/YYYY`, `DD/MM/YYYY`.

## Sample template

Use: `public/templates/day_change_template.csv`

## Assumptions

- The first sheet in Excel files is parsed.
- If both `prev_close` and `open` are absent, the row is rejected.
- Uploaded rows are normalized to uppercase symbols and ISO dates.
- Aggregated default chart (when no stock selected) displays date-wise total day change.

## Notes

- No shadcn/ui dependency was used to keep the install concise and focused on requested packages.
