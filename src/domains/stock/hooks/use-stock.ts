"use client";

import { useState, useCallback } from "react";
import type {
  StockReport,
  StockReportSummarized,
  SigmaData,
  WatchlistItem,
  WatchlistCreateInput,
  WatchlistUpdateInput,
  MarketStatus,
  StockAnalyzeResult,
  StockQuote,
  StockWem,
  StockAnalysis,
} from "../types";
import type { ApiResponse } from "@/shared/types";

export function useStockReports() {
  const [reports, setReports] = useState<StockReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (tickers?: string) => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      if (tickers) sp.set("tickers", tickers);
      const res = await fetch(`/api/stock/report?${sp.toString()}`);
      const data: ApiResponse<StockReport[]> = await res.json();
      if (data.success && data.data) {
        setReports(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch reports");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { reports, loading, error, fetchReports };
}

export function useAllStockReports() {
  const [reports, setReports] = useState<StockReportSummarized[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (summarize = true) => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      sp.set("summarize", String(summarize));
      const res = await fetch(`/api/stock/report/all?${sp.toString()}`);
      const data: ApiResponse<StockReportSummarized[]> = await res.json();
      if (data.success && data.data) {
        setReports(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch reports");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { reports, loading, error, fetchReports };
}

export function useSigmaData() {
  const [sigma, setSigma] = useState<SigmaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSigma = useCallback(async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stock/sigma?ticker=${encodeURIComponent(ticker)}`);
      const data: ApiResponse<SigmaData> = await res.json();
      if (data.success && data.data) {
        setSigma(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch sigma");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { sigma, loading, error, fetchSigma };
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stock/watchlist");
      const data: ApiResponse<WatchlistItem[]> = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch watchlist");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (input: WatchlistCreateInput) => {
    const res = await fetch("/api/stock/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<WatchlistItem> = await res.json();
    if (data.success && data.data) {
      setItems((prev) => [...prev, data.data!]);
      return data.data;
    }
    throw new Error(data.error?.message || "Failed to add item");
  }, []);

  const updateItem = useCallback(async (id: string, input: WatchlistUpdateInput) => {
    const res = await fetch(`/api/stock/watchlist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<WatchlistItem> = await res.json();
    if (data.success && data.data) {
      setItems((prev) => prev.map((i) => (i.id === id ? data.data! : i)));
      return data.data;
    }
    throw new Error(data.error?.message || "Failed to update item");
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const res = await fetch(`/api/stock/watchlist/${id}`, { method: "DELETE" });
    const data: ApiResponse<{ deleted: number }> = await res.json();
    if (data.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return true;
    }
    throw new Error(data.error?.message || "Failed to delete item");
  }, []);

  return { items, loading, error, fetchWatchlist, addItem, updateItem, deleteItem };
}

export function useMarketStatus() {
  const [status, setStatus] = useState<MarketStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stock/market-status");
      const data: ApiResponse<MarketStatus> = await res.json();
      if (data.success && data.data) {
        setStatus(data.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  return { status, loading, fetchStatus };
}

export function useStockAnalyze() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockAnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerAnalyze = useCallback(async (tickers?: string) => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      if (tickers) sp.set("tickers", tickers);
      const res = await fetch(`/api/crawling/stock/analyze?${sp.toString()}`, { method: "POST" });
      const data: ApiResponse<StockAnalyzeResult> = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error?.message || "Analyze failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, error, triggerAnalyze };
}

export function useStockSigmaCrawl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSigmaCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/stock/sigma", { method: "POST" });
      const data: ApiResponse<{ items_fetched: number; items_new: number }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "Sigma crawl failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerSigmaCrawl };
}

export function useStockSigmaCompute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCompute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/stock/sigma/compute", { method: "POST" });
      const data: ApiResponse<{ computed: number }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "Sigma compute failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerCompute };
}

export function useStockSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerSync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/stock/sync", { method: "POST" });
      const data: ApiResponse<{ synced: number }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "Sync failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerSync };
}

// #44 — 실시간 quote
export function useStockQuote() {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stock/quote/${encodeURIComponent(ticker)}`);
      const data: ApiResponse<StockQuote> = await res.json();
      if (data.success && data.data) {
        setQuote(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch quote");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { quote, loading, error, fetchQuote };
}

// #44 — 주간 예상 움직임 (WEM)
export function useStockWem() {
  const [wem, setWem] = useState<StockWem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWem = useCallback(async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/stock/sigma/${encodeURIComponent(ticker)}/wem`,
      );
      const data: ApiResponse<StockWem> = await res.json();
      if (data.success && data.data) {
        setWem(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch WEM");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { wem, loading, error, fetchWem };
}

// #44 — 분석 결과 (전체)
export function useStockAnalysis() {
  const [items, setItems] = useState<StockAnalysis[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stock/analysis");
      const data: ApiResponse<StockAnalysis[]> = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch analysis");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, fetchAnalysis };
}

// #44 — 최신 분석
export function useStockAnalysisLatest() {
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stock/analysis/latest");
      const data: ApiResponse<StockAnalysis> = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch latest analysis");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { analysis, loading, error, fetchLatest };
}

// #44 — Sigma 데이터 새로고침
export function useStockRefreshSigma() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerRefreshSigma = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/stock/refresh-sigma", {
        method: "POST",
      });
      const data: ApiResponse<{ refreshed?: number }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "Sigma refresh failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerRefreshSigma };
}

// #44 — WEM 새로고침
export function useStockRefreshWem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerRefreshWem = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/stock/refresh-wem", {
        method: "POST",
      });
      const data: ApiResponse<{ refreshed?: number }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "WEM refresh failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerRefreshWem };
}
