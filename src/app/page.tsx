"use client";

import { useEffect, useState } from "react";
import { useWeather } from "@/domains/weather/hooks/use-weather";
import { useWeatherCrawl } from "@/domains/weather/hooks/use-weather";
import { useNews } from "@/domains/news/hooks/use-news";
import { useNewsCrawl } from "@/domains/news/hooks/use-news";
import { useAllStockReports, useStockAnalyze } from "@/domains/stock/hooks/use-stock";
import { WeatherWidget } from "@/domains/weather/components/weather-widget";
import { NewsCard } from "@/domains/news/components/news-card";
import { NewsDetail } from "@/domains/news/components/news-detail";
import { StockReportCard } from "@/domains/stock/components/stock-report-card";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Newspaper, TrendingUp, Cloud } from "lucide-react";
import type { NewsArticle } from "@/domains/news/types";

export default function DashboardPage() {
  const { weather, fetchWeather } = useWeather();
  const { triggerCrawl: triggerWeatherCrawl, loading: weatherCrawlLoading } = useWeatherCrawl();
  const { articles, fetchNews } = useNews();
  const { triggerCrawl: triggerNewsCrawl, loading: newsCrawlLoading } = useNewsCrawl();
  const { reports, fetchReports } = useAllStockReports();
  const { triggerAnalyze, loading: stockAnalyzeLoading } = useStockAnalyze();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [weatherExpanded, setWeatherExpanded] = useState(false);

  useEffect(() => {
    fetchWeather();
    fetchNews({ limit: 5 });
    fetchReports(true);
  }, [fetchWeather, fetchNews, fetchReports]);

  const handleWeatherCrawl = async () => {
    await triggerWeatherCrawl();
    await fetchWeather();
  };

  const handleNewsCrawl = async () => {
    await triggerNewsCrawl();
    await fetchNews({ limit: 5 });
  };

  const handleStockAnalyze = async () => {
    await triggerAnalyze();
    await fetchReports(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Weather Widget */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            날씨
          </h2>
          <CrawlTriggerButton
            onClick={handleWeatherCrawl}
            loading={weatherCrawlLoading}
            label="날씨 수집"
          />
        </div>
        {weather ? (
          <div
            className="cursor-pointer"
            onClick={() => setWeatherExpanded(!weatherExpanded)}
          >
            <WeatherWidget weather={weather} compact={!weatherExpanded} />
          </div>
        ) : (
          <Skeleton className="h-24 w-full rounded-xl" />
        )}
      </section>

      {/* News Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            최신 뉴스
          </h2>
          <div className="flex gap-2">
            <CrawlTriggerButton
              onClick={handleNewsCrawl}
              loading={newsCrawlLoading}
              label="뉴스 수집"
            />
            <Link
              href="/news"
              className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-secondary/80"
            >
              전체 보기
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {articles.length > 0
            ? articles.slice(0, 5).map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={setSelectedArticle}
                />
              ))
            : Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
        </div>
      </section>

      {/* Stock Summary */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            주식 리포트
          </h2>
          <div className="flex gap-2">
            <CrawlTriggerButton
              onClick={handleStockAnalyze}
              loading={stockAnalyzeLoading}
              label="분석 실행"
            />
            <Link
              href="/stock"
              className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-secondary/80"
            >
              전체 보기
            </Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reports.length > 0
            ? reports.slice(0, 8).map((report) => (
                <Link
                  key={report.ticker}
                  href={`/stock/${report.ticker}`}
                  className="block"
                >
                  <StockReportCard report={report} />
                </Link>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
        </div>
      </section>

      {/* Selected News Detail (inline) */}
      {selectedArticle && (
        <NewsDetail
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
