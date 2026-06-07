"use client";
import { useState, useCallback } from "react";
import type { RssEntry, RssEntryParams, RssFeed, RssFeedCreateParams } from "../types";
import type { ApiResponse } from "@/shared/types";

export function useRssEntries() {
  const [entries, setEntries] = useState<RssEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async (params?: RssEntryParams) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params?.feed_id) searchParams.set("feed_id", String(params.feed_id));
      if (params?.sort) searchParams.set("sort", params.sort);
      if (params?.order) searchParams.set("order", params.order);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.page) searchParams.set("page", String(params.page));
      const qs = searchParams.toString();
      const res = await fetch(`/api/rss-universal/entries${qs ? `?${qs}` : ""}`);
      const data: ApiResponse<RssEntry[]> = await res.json();
      if (data.success && data.data) {
        setEntries(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch RSS entries");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { entries, loading, error, fetchEntries };
}

export function useRssFeeds() {
  const [feeds, setFeeds] = useState<RssFeed[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rss-universal/feeds");
      const data: ApiResponse<RssFeed[]> = await res.json();
      if (data.success && data.data) {
        setFeeds(data.data);
      } else {
        setError(data.error?.message || "Failed to fetch RSS feeds");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const addFeed = useCallback(async (params: RssFeedCreateParams) => {
    setError(null);
    try {
      const res = await fetch("/api/rss-universal/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data: ApiResponse<RssFeed> = await res.json();
      if (data.success && data.data) {
        setFeeds((prev) => (prev ? [...prev, data.data!] : [data.data!]));
      } else {
        setError(data.error?.message || "Failed to add feed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  const deleteFeed = useCallback(async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/rss-universal/feeds/${id}`, {
        method: "DELETE",
      });
      const data: ApiResponse<null> = await res.json();
      if (data.success) {
        setFeeds((prev) => (prev ? prev.filter((f) => f.id !== id) : null));
      } else {
        setError(data.error?.message || "Failed to delete feed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  return { feeds, loading, error, fetchFeeds, addFeed, deleteFeed };
}

export function useRssCrawl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/rss-universal", {
        method: "POST",
      });
      const data: ApiResponse<{ items_fetched: number; items_new: number }> =
        await res.json();
      if (!data.success) {
        setError(data.error?.message || "RSS crawl failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerCrawl };
}
