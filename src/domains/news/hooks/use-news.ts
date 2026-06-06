"use client";

import { useState, useCallback } from "react";
import type { NewsArticle, NewsListParams, CrawlingResult } from "../types";
import type { ApiResponse } from "@/shared/types";

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchNews = useCallback(async (params?: NewsListParams) => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      if (params?.minutes) sp.set("minutes", String(params.minutes));
      if (params?.from) sp.set("from", params.from);
      if (params?.to) sp.set("to", params.to);
      if (params?.category) sp.set("category", params.category);
      if (params?.min_importance) sp.set("min_importance", String(params.min_importance));
      if (params?.limit) sp.set("limit", String(params.limit));
      if (params?.page) sp.set("page", String(params.page));

      const res = await fetch(`/api/news?${sp.toString()}`);
      const data: ApiResponse<NewsArticle[]> = await res.json();
      if (data.success && data.data) {
        setArticles(data.data);
        setTotal(data.meta?.total ?? 0);
      } else {
        setError(data.error?.message || "Failed to fetch news");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { articles, loading, error, total, fetchNews };
}

export function useNewsArticle() {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news/${id}`);
      const data: ApiResponse<NewsArticle> = await res.json();
      if (data.success && data.data) {
        setArticle(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch article");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { article, loading, error, fetchArticle };
}

export function useNewsCrawl() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrawlingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/news", { method: "POST" });
      const data: ApiResponse<CrawlingResult> = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error?.message || "Crawl failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, error, triggerCrawl };
}
