"use client";
import { useState, useCallback } from "react";
import type { RedditPost, RedditParams } from "../types";
import type { ApiResponse } from "@/shared/types";

export function useReddit() {
  const [posts, setPosts] = useState<RedditPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async ({
      subreddit,
      sort,
      order,
      limit,
      page,
    }: RedditParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (subreddit) params.set("subreddit", subreddit);
        if (sort) params.set("sort", sort);
        if (order) params.set("order", order);
        if (limit) params.set("limit", String(limit));
        if (page) params.set("page", String(page));
        const qs = params.toString();
        const res = await fetch(`/api/reddit${qs ? `?${qs}` : ""}`);
        const data: ApiResponse<RedditPost[]> = await res.json();
        if (data.success && data.data) {
          setPosts(data.data);
        } else {
          setError(data.error?.message || "Failed to fetch Reddit posts");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { posts, loading, error, fetchPosts };
}

export function useRedditCrawl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCrawl = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawling/reddit", {
        method: "POST",
      });
      const data: ApiResponse<{
        items_fetched: number;
        items_new: number;
      }> = await res.json();
      if (!data.success) {
        setError(data.error?.message || "Reddit crawl failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, triggerCrawl };
}
