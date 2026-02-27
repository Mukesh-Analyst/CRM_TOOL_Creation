export type ParsedRow = {
  id: string;
  date: string;
  symbol: string;
  close: number;
  prev_close: number;
  day_change: number;
  day_change_pct: number;
};

export type UploadError = {
  rowIndex?: number;
  message: string;
};

export type BuyLot = {
  id: string;
  new_price: number;
  new_stock_qty: number;
};

export type QuickRange = '1W' | '1M' | '3M' | 'YTD' | 'ALL';
