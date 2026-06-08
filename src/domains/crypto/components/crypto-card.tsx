"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import type { CryptoPrice } from "../types";

interface CryptoCardProps {
  crypto: CryptoPrice;
}

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatLargeNumber(value: number | null): string | null {
  if (value === null) return null;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString("en-US")}`;
}

export function CryptoCard({ crypto }: CryptoCardProps) {
  const change = crypto.price_change_percentage_24h;
  const isPositive = change !== null ? change >= 0 : true;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="block">
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {crypto.image_url && (
                <img
                  src={crypto.image_url}
                  alt={crypto.symbol}
                  className="h-6 w-6 rounded-full"
                />
              )}
              <CardTitle className="text-base font-semibold">
                {crypto.symbol.toUpperCase()}{" "}
                <span className="text-muted-foreground font-normal text-sm">
                  {crypto.name}
                </span>
              </CardTitle>
            </div>
            <TrendingUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-bold">${formatPrice(crypto.current_price)}</p>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            <ChangeIcon className="h-4 w-4" />
            <span>{change !== null ? `${Math.abs(change).toFixed(2)}%` : "—"}</span>
          </div>
          {(crypto.market_cap !== null || crypto.total_volume !== null) && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {crypto.market_cap !== null && (
                <span>시총 {formatLargeNumber(crypto.market_cap)}</span>
              )}
              {crypto.total_volume !== null && (
                <span>거래량 {formatLargeNumber(crypto.total_volume)}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
