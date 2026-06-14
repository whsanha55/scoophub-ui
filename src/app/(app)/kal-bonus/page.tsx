"use client";

import { useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { useKalBonus, useKalBonusCrawl } from "@/domains/kal-bonus/hooks/use-kal-bonus";
import { KalBonusRouteCard } from "@/domains/kal-bonus/components/kal-bonus-card";
import type { KalBonusItem } from "@/domains/kal-bonus/types";

function monthKey(item: KalBonusItem): string {
  return item.key.split("-")[0];
}

function fmtMonth(yyyymm: string): string {
  if (yyyymm.length !== 6) return yyyymm;
  return `${yyyymm.slice(0, 4)}년 ${Number(yyyymm.slice(4, 6))}월`;
}

export default function KalBonusPage() {
  const { items, loading, error, fetchKalBonus } = useKalBonus();
  const { loading: crawlLoading, error: crawlError, triggerCrawl } = useKalBonusCrawl();

  useEffect(() => {
    fetchKalBonus();
  }, [fetchKalBonus]);

  // 월별 그룹 (내림차순 정렬 X, 오름차순)
  const grouped = useMemo(() => {
    const map = new Map<string, KalBonusItem[]>();
    (items ?? []).forEach((it) => {
      const k = monthKey(it);
      const arr = map.get(k) ?? [];
      arr.push(it);
      map.set(k, arr);
    });
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, list]) => ({
        month: k,
        label: fmtMonth(k),
        routes: list.sort((a, b) =>
          (a.parsed?.arrival ?? "").localeCompare(b.parsed?.arrival ?? ""),
        ),
      }));
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">KAL 보너스</h1>
        <CrawlTriggerButton onClick={triggerCrawl} loading={crawlLoading} label="수동 크롤" />
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="text-green-500 font-bold">●</span> 좌석 있음
        </span>
        <span className="flex items-center gap-1">
          <span className="opacity-40">○</span> 매진
        </span>
        <span className="flex items-center gap-1">
          <span>-</span> 해당 없음
        </span>
      </div>

      {crawlError && <p className="text-destructive text-sm">{crawlError}</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {loading && (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      )}

      {!loading && !error && grouped.length === 0 && (
        <p className="text-muted-foreground text-sm">데이터가 없습니다.</p>
      )}

      {grouped.map((g) => (
        <div key={g.month} className="space-y-3">
          <h2 className="text-lg font-semibold border-b border-border pb-1">
            {g.label}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {g.routes.length}개 노선
            </span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {g.routes.map((item) => (
              <KalBonusRouteCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
