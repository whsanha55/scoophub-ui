"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { useKalBonus, useKalBonusCrawl } from "@/domains/kal-bonus/hooks/use-kal-bonus";
import { KalBonusCard } from "@/domains/kal-bonus/components/kal-bonus-card";

export default function KalBonusPage() {
  const { items, loading, error, fetchKalBonus } = useKalBonus();
  const { loading: crawlLoading, error: crawlError, triggerCrawl } = useKalBonusCrawl();

  useEffect(() => {
    fetchKalBonus();
  }, [fetchKalBonus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">KAL 보너스</h1>
        <CrawlTriggerButton
          onClick={triggerCrawl}
          loading={crawlLoading}
          label="수동 크롤"
        />
      </div>

      {crawlError && <p className="text-destructive text-sm">{crawlError}</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading && (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      )}

      {!loading && !error && items && items.length === 0 && (
        <p className="text-muted-foreground text-sm">데이터가 없습니다.</p>
      )}

      {items && items.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item, idx) => (
            <KalBonusCard
              key={item.id != null ? item.id : idx}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}
