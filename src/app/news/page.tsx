"use client";

import { useEffect, useState, useCallback } from "react";
import { useNews, useNewsArticle, useNewsCrawl } from "@/domains/news/hooks/use-news";
import { NewsCard } from "@/domains/news/components/news-card";
import { NewsDetail } from "@/domains/news/components/news-detail";
import { NewsFilters } from "@/domains/news/components/news-filters";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsArticle } from "@/domains/news/types";

export default function NewsPage() {
  const { articles, loading, fetchNews } = useNews();
  const { article: selectedArticle, fetchArticle } = useNewsArticle();
  const { loading: crawlLoading, triggerCrawl } = useNewsCrawl();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [minImportance, setMinImportance] = useState<number | null>(null);

  const loadNews = useCallback(() => {
    fetchNews({
      category: category ?? undefined,
      min_importance: minImportance ?? undefined,
      limit: 50,
    });
  }, [fetchNews, category, minImportance]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    if (selectedId) {
      fetchArticle(selectedId);
    }
  }, [selectedId, fetchArticle]);

  const handleCrawl = async () => {
    await triggerCrawl();
    await loadNews();
  };

  if (selectedId && selectedArticle) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">뉴스</h1>
        <NewsDetail
          article={selectedArticle}
          onBack={() => setSelectedId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">뉴스</h1>
        <CrawlTriggerButton
          onClick={handleCrawl}
          loading={crawlLoading}
          label="뉴스 수집 실행"
        />
      </div>

      <NewsFilters
        selectedCategory={category}
        minImportance={minImportance}
        onSelectCategory={setCategory}
        onSelectImportance={setMinImportance}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          뉴스 기사가 없습니다
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onClick={(a: NewsArticle) => setSelectedId(a.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
