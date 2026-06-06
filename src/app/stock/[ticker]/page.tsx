"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStockReports, useSigmaData } from "@/domains/stock/hooks/use-stock";
import { SigmaPanel } from "@/domains/stock/components/sigma-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

function signalColor(signal: string): string {
  const s = signal.toUpperCase();
  if (s === "BUY" || s === "STRONG_BUY") return "text-green-500";
  if (s === "SELL" || s === "STRONG_SELL") return "text-red-500";
  return "text-yellow-500";
}

export default function StockDetailPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = params.ticker as string;

  const { reports, loading, fetchReports } = useStockReports();
  const { sigma, loading: sigmaLoading, fetchSigma } = useSigmaData();

  useEffect(() => {
    if (ticker) {
      fetchReports(ticker);
      fetchSigma(ticker);
    }
  }, [ticker, fetchReports, fetchSigma]);

  const report = reports.length > 0 ? reports[0] : null;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-4">
        <Link href="/stock">
          <Button variant="ghost" size="sm" className="cursor-pointer transition-colors duration-200">
            <ArrowLeft className="mr-1 h-4 w-4" />
            돌아가기
          </Button>
        </Link>
        <p className="text-muted-foreground">리포트를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const changeColor =
    report.change > 0
      ? "text-green-500"
      : report.change < 0
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <div className="space-y-6">
      <Link href="/stock">
        <Button variant="ghost" size="sm" className="cursor-pointer transition-colors duration-200">
          <ArrowLeft className="mr-1 h-4 w-4" />
          돌아가기
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{report.ticker}</h1>
            <Badge variant="outline" className="text-xs">
              {report.exchange}
            </Badge>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-3xl font-bold">${report.price.toFixed(2)}</span>
            <span className={`text-sm font-medium ${changeColor}`}>
              {report.change > 0 ? "+" : ""}
              {report.change.toFixed(2)} ({report.change_rate.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${signalColor(report.technical.signal)} text-xs`}
          >
            {report.technical.signal}
          </Badge>
          {report.is_stale && (
            <Badge variant="secondary" className="text-xs">Stale data</Badge>
          )}
        </div>
      </div>

      {/* Technical Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">기술적 분석</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Signal</span>
              <p className={`font-semibold ${signalColor(report.technical.signal)}`}>
                {report.technical.signal}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Score</span>
              <p className="font-semibold">{report.technical.total_score.toFixed(1)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence</span>
              <p className="font-semibold">{report.technical.confidence.toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Market Regime</span>
              <p className="font-semibold capitalize">{report.technical.market_regime}</p>
            </div>
          </div>

          {/* Technical Scores */}
          <div>
            <p className="text-sm font-medium mb-2">기술적 지표 점수</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {Object.entries(report.technical.technical_scores).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border p-2">
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <p className="font-semibold">{typeof value === "number" ? value.toFixed(1) : String(value)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <p className="text-sm font-medium mb-2">기술적 상세</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {Object.entries(report.technical.technical_details).filter(([, v]) => typeof v === "number").map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border p-2">
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <p className="font-semibold">{(value as number).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sigma Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sigma 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Position</span>
              <p className="font-semibold capitalize">{report.sigma.sigma_position}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Signal</span>
              <p className="font-semibold capitalize">{report.sigma.sigma_signal}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence</span>
              <p className="font-semibold">{(report.sigma.sigma_confidence * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Expected Move</span>
              <p className="font-semibold">{report.sigma.expected_move_pct.toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Expected High</span>
              <p className="font-semibold">${report.sigma.expected_move_high.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Expected Low</span>
              <p className="font-semibold">${report.sigma.expected_move_low.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Source</span>
              <p className="font-semibold">{report.sigma.source}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sigma Panel (detailed options data) */}
      {sigma && <SigmaPanel sigma={sigma} />}

      {/* Meta */}
      <div className="text-xs text-muted-foreground">
        데이터 기준일: {report.data_date}
        {sigmaLoading && <span className="ml-2">(시그마 데이터 로딩 중...)</span>}
      </div>
    </div>
  );
}
