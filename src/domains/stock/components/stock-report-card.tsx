"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StockReportSummarized } from "../types";

function signalColor(signal: string): string {
  const s = signal.toUpperCase();
  if (s === "BUY" || s === "STRONG_BUY") return "text-green-500";
  if (s === "SELL" || s === "STRONG_SELL") return "text-red-500";
  return "text-yellow-500";
}

function ChangeIcon({ change }: { change: number }) {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function StockReportCard({ report }: { report: StockReportSummarized }) {
  const changeColor =
    report.change > 0
      ? "text-green-500"
      : report.change < 0
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {report.ticker}
            <span className="text-xs text-muted-foreground font-normal">
              {report.exchange}
            </span>
          </CardTitle>
          <Badge
            variant="outline"
            className={`${signalColor(report.signal)} text-xs`}
          >
            {report.signal}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">${report.price.toFixed(2)}</span>
          <span className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}>
            <ChangeIcon change={report.change} />
            {report.change > 0 ? "+" : ""}
            {report.change.toFixed(2)} ({report.change_rate.toFixed(2)}%)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            Score: <span className="text-foreground font-medium">{report.total_score.toFixed(1)}</span>
          </div>
          <div>
            Confidence: <span className="text-foreground font-medium">{report.confidence.toFixed(1)}%</span>
          </div>
          <div>
            Regime: <span className="text-foreground font-medium capitalize">{report.market_regime}</span>
          </div>
          <div>
            1σ Move: <span className="text-foreground font-medium">{report.expected_move_pct.toFixed(1)}%</span>
          </div>
        </div>
        {report.is_stale && (
          <Badge variant="secondary" className="text-xs">
            Stale data
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
