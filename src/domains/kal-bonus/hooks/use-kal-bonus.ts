"use client";

import { useState, useCallback } from "react";
import type { KalBonusItem } from "../types";
import type { ApiResponse } from "@/shared/types";

export function useKalBonus() {
  const [items, setItems] = useState<KalBonusItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKalBonus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kal-bonus");
      const data: ApiResponse<KalBonusItem[]> = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch KAL bonus");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, loading, error, fetchKalBonus };
}

export function useKalBonusCrawl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/kal-bonus", { method: "POST" });
      const data: ApiResponse<{ items_fetched?: number; items_new?: number }> =
        await res.json();
      if (!data.success) {
        setError(data.error?.message || "KAL bonus crawl failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerCrawl };
}
