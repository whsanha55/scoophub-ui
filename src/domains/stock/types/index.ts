export interface StockReport {
  ticker: string;
  exchange: string;
  price: number;
  change: number;
  change_rate: number;
  technical: {
    signal: string;
    total_score: number;
    confidence: number;
    market_regime: string;
    technical_scores: Record<string, number>;
    technical_details: Record<string, number>;
  };
  sigma: {
    sigma_position: string;
    sigma_signal: string;
    sigma_confidence: number;
    expected_move_pct: number;
    expected_move_high: number;
    expected_move_low: number;
    source: string;
    weekly_moves: unknown[];
  };
  data_date: string;
  is_stale: boolean;
}

export interface StockReportSummarized {
  ticker: string;
  exchange: string;
  price: number;
  change: number;
  change_rate: number;
  signal: string;
  total_score: number;
  confidence: number;
  market_regime: string;
  sigma_position: string;
  sigma_signal: string;
  sigma_confidence: number;
  expected_move_pct: number;
  data_date: string;
  is_stale: boolean;
}

export interface SigmaData {
  ticker: string;
  current_price: number;
  expiry_date: string;
  atm_strike: number;
  atm_call: number;
  atm_put: number;
  expected_move: number;
  expected_move_pct: number;
  snapshot_date: string;
  snapshot_at: string;
  source: string;
  total_call_volume: number;
  total_put_volume: number;
  put_call_volume_ratio: number;
  atm_call_volume: number;
  atm_put_volume: number;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  exchange: string;
  name: string;
  memo: string;
  added_at: string;
  is_active: boolean;
}

export interface WatchlistCreateInput {
  ticker: string;
  exchange: string;
  name: string;
  memo?: string;
}

export interface WatchlistUpdateInput {
  memo?: string;
  is_active?: boolean;
}

export interface MarketStatus {
  is_open: boolean;
  is_weekday: boolean;
  current_utc: string;
}

export interface StockAnalyzeResult {
  total: number;
  ok: number;
  errors: number;
  results: { ticker: string; status: string; detail?: string }[];
}
