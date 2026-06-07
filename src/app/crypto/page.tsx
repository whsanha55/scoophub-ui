"use client";

import { useEffect } from "react";
import { useCryptoPrices, useCryptoCrawl } from "@/domains/crypto/hooks/use-crypto";
import { CryptoCard } from "@/domains/crypto/components/crypto-card";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "current_price" as const, label: "가격순" },
  { value: "market_cap" as const, label: "시총순" },
  { value: "price_change_percentage_24h" as const, label: "변동률순" },
];

type Sort = "current_price" | "market_cap" | "price_change_percentage_24h";

export default function CryptoPage() {
  const { prices, loading, fetchPrices } = useCryptoPrices();
  const { loading: crawlLoading, triggerCrawl } = useCryptoCrawl();

  useEffect(() => {
    fetchPrices({ sort: "market_cap", order: "desc", limit: 50 });
  }, [fetchPrices]);

  const handleSortChange = (newSort: Sort) => {
    fetchPrices({ sort: newSort, order: "desc", limit: 50 });
  };

  const handleCrawl = async () => {
    await triggerCrawl();
    await fetchPrices({ sort: "market_cap", order: "desc", limit: 50 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">암호화폐 시세</h1>
        <CrawlTriggerButton
          onClick={handleCrawl}
          loading={crawlLoading}
          label="크롤 수집"
        />
      </div>

      <div className="flex gap-1">
        {SORT_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant="outline"
            size="sm"
            onClick={() => handleSortChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : prices && prices.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {prices.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          암호화폐 데이터가 없습니다
        </div>
      )}
    </div>
  );
}
