"use client";

import { useEffect, useState } from "react";
import {
  useAllStockReports,
  useWatchlist,
  useSigmaData,
  useStockAnalyze,
  useStockSigmaCrawl,
  useMarketStatus,
} from "@/domains/stock/hooks/use-stock";
import { StockReportCard } from "@/domains/stock/components/stock-report-card";
import { WatchlistPanel } from "@/domains/stock/components/watchlist-panel";
import { SigmaPanel } from "@/domains/stock/components/sigma-panel";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { SigmaData } from "@/domains/stock/types";

export default function StockPage() {
  const { reports, loading: reportsLoading, fetchReports } = useAllStockReports();
  const {
    items: watchlist,
    loading: watchlistLoading,
    fetchWatchlist,
    addItem,
    deleteItem,
    updateItem,
  } = useWatchlist();
  const { sigma, fetchSigma } = useSigmaData();
  const { loading: analyzeLoading, triggerAnalyze } = useStockAnalyze();
  const { loading: sigmaCrawlLoading, triggerSigmaCrawl } = useStockSigmaCrawl();
  const { status: marketStatus, fetchStatus } = useMarketStatus();
  const [selectedSigma, setSelectedSigma] = useState<SigmaData | null>(null);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  useEffect(() => {
    fetchReports(true);
    fetchWatchlist();
    fetchStatus();
  }, [fetchReports, fetchWatchlist, fetchStatus]);

  const handleAnalyze = async () => {
    await triggerAnalyze();
    await fetchReports(true);
  };

  const handleSigmaCrawl = async () => {
    await triggerSigmaCrawl();
    await fetchReports(true);
  };

  const handleTickerClick = async (ticker: string) => {
    setSelectedTicker(ticker);
    await fetchSigma(ticker);
  };

  useEffect(() => {
    if (selectedTicker && sigma) {
      setSelectedSigma(sigma);
    }
  }, [selectedTicker, sigma]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">주식</h1>
        <div className="flex items-center gap-2">
          {marketStatus && (
            <Badge variant={marketStatus.is_open ? "default" : "secondary"}>
              {marketStatus.is_open ? "장 열림" : "장 닫힘"}
            </Badge>
          )}
          <CrawlTriggerButton
            onClick={handleAnalyze}
            loading={analyzeLoading}
            label="분석 실행"
          />
          <CrawlTriggerButton
            onClick={handleSigmaCrawl}
            loading={sigmaCrawlLoading}
            label="시그마 수집"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Watchlist */}
        <div className="lg:col-span-1">
          <WatchlistPanel
            items={watchlist}
            onAdd={addItem}
            onDelete={deleteItem}
            onUpdate={updateItem}
          />
        </div>

        {/* Reports + Sigma */}
        <div className="lg:col-span-2 space-y-4">
          {reportsLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              리포트가 없습니다. Watchlist에 종목을 추가하고 분석을 실행하세요.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {reports.map((report) => (
                <div
                  key={report.ticker}
                  onClick={() => handleTickerClick(report.ticker)}
                  className="cursor-pointer"
                >
                  <StockReportCard report={report} />
                </div>
              ))}
            </div>
          )}

          {selectedSigma && <SigmaPanel sigma={selectedSigma} />}
        </div>
      </div>
    </div>
  );
}
