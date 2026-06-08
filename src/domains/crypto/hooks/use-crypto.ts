"use client";
import { useState, useCallback } from "react";
import type { CryptoPrice, CryptoPriceParams } from "../types";
import type { ApiResponse } from "@/shared/types";

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(
    async ({
      sort,
      order,
      limit,
      page,
    }: CryptoPriceParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (sort) params.set("sort", sort);
        if (order) params.set("order", order);
        if (limit) params.set("limit", String(limit));
        if (page) params.set("page", String(page));
        const qs = params.toString();
        const res = await fetch(`/api/exchange-crypto${qs ? `?${qs}` : ""}`);
        const data: ApiResponse<CryptoPrice[]> = await res.json();
        if (data.success && data.data) {
          setPrices(data.data);
        } else {
          setError(data.error?.message || "Failed to fetch crypto prices");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { prices, loading, error, fetchPrices };
}

export function useCryptoCrawl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/exchange-crypto", {
        method: "POST",
      });
      const data: ApiResponse<{
        items_fetched: number;
        items_new: number;
      }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "Crypto crawl failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerCrawl };
}
