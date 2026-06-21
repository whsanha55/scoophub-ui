"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    fetchKalBonus();
  }, [fetchKalBonus]);

  // 월별 그룹 (오름차순 정렬 — 끝 요소가 최신 월)
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

  // 파생값: 미선택 시 최신 월(오름차순 끝)로 자동 폴백.
  // useState 초기값 대신 파생값을 쓰는 이유 — 첫 렌더엔 items가 비어 grouped가 빈 배열이라
  // useState lazy initializer가 null로 고정되는 버그를 피하기 위해.
  const activeMonth = selectedMonth ?? grouped[grouped.length - 1]?.month ?? null;
  const activeRoutes =
    grouped.find((g) => g.month === activeMonth)?.routes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">대한항공 마일리지 좌석</h1>
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

      {/* 월 탭 (가로 스크롤) */}
      {!loading && grouped.length > 0 && (
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="flex gap-2 w-max pb-1">
            {grouped.map((g) => {
              const active = g.month === activeMonth;
              return (
                <Button
                  key={g.month}
                  variant={active ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedMonth(g.month)}
                  className="cursor-pointer whitespace-nowrap"
                >
                  {g.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      )}

      {!loading && !error && grouped.length === 0 && (
        <p className="text-muted-foreground text-sm">데이터가 없습니다.</p>
      )}

      {!loading && activeRoutes.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {activeRoutes.map((item) => (
            <KalBonusRouteCard key={item.key} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
