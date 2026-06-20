"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useStockReports,
  useSigmaData,
  useStockQuote,
  useStockWem,
  useStockAnalysisLatest,
  useStockRefreshSigma,
  useStockRefreshWem,
} from "@/domains/stock/hooks/use-stock";
import { SigmaPanel } from "@/domains/stock/components/sigma-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RefreshCw } from "lucide-react";

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
  const { quote, loading: quoteLoading, error: quoteError, fetchQuote } = useStockQuote();
  const { wem, loading: wemLoading, error: wemError, fetchWem } = useStockWem();
  const { analysis, loading: analysisLoading, error: analysisError, fetchLatest } =
    useStockAnalysisLatest();
  const { loading: refreshSigmaLoading, error: refreshSigmaError, triggerRefreshSigma } =
    useStockRefreshSigma();
  const { loading: refreshWemLoading, error: refreshWemError, triggerRefreshWem } =
    useStockRefreshWem();

  useEffect(() => {
    if (ticker) {
      fetchReports(ticker);
      fetchSigma(ticker);
      fetchQuote(ticker);
      fetchWem(ticker);
      fetchLatest();
    }
  }, [ticker, fetchReports, fetchSigma, fetchQuote, fetchWem, fetchLatest]);

  const handleRefreshSigma = async () => {
    await triggerRefreshSigma();
    fetchSigma(ticker);
  };
  const handleRefreshWem = async () => {
    await triggerRefreshWem();
    fetchWem(ticker);
  };

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

      {/* #57 — 액션러블 레벨 (optional, 레거시 호환) */}
      {(report.actionable_levels || report.hit_rate != null) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">액션러블 레벨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {report.actionable_levels?.target != null && (
                <div>
                  <span className="text-muted-foreground">목표가</span>
                  <p className="font-semibold">${report.actionable_levels.target.toFixed(2)}</p>
                </div>
              )}
              {report.actionable_levels?.buy != null && (
                <div>
                  <span className="text-muted-foreground">매수가</span>
                  <p className="font-semibold text-green-500">${report.actionable_levels.buy.toFixed(2)}</p>
                </div>
              )}
              {report.actionable_levels?.stop != null && (
                <div>
                  <span className="text-muted-foreground">손절가</span>
                  <p className="font-semibold text-red-500">${report.actionable_levels.stop.toFixed(2)}</p>
                </div>
              )}
              {report.actionable_levels?.momentum != null && (
                <div>
                  <span className="text-muted-foreground">모멘텀</span>
                  <p className="font-semibold">{report.actionable_levels.momentum.toFixed(2)}</p>
                </div>
              )}
              {report.hit_rate != null && (
                <div>
                  <span className="text-muted-foreground">히트레이트</span>
                  <p className="font-semibold">{(report.hit_rate > 1 ? report.hit_rate : report.hit_rate * 100).toFixed(0)}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sigma Panel (detailed options data) */}
      {sigma && <SigmaPanel sigma={sigma} />}

      {/* #44 — 실시간 Quote */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>실시간 주가</span>
            <Button
              size="sm"
              variant="outline"
              disabled={quoteLoading}
              onClick={() => fetchQuote(ticker)}
              className="cursor-pointer transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${quoteLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quoteError && <p className="text-destructive text-sm">{quoteError}</p>}
          {!quote && !quoteLoading && !quoteError && (
            <p className="text-muted-foreground text-sm">실시간 quote를 불러올 수 없습니다.</p>
          )}
          {quote && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">현재가</span>
                <p className="font-semibold">${quote.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">변동</span>
                <p
                  className={`font-semibold ${
                    quote.change > 0
                      ? "text-green-500"
                      : quote.change < 0
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {quote.change > 0 ? "+" : ""}
                  {quote.change.toFixed(2)} ({quote.change_rate.toFixed(2)}%)
                </p>
              </div>
              {quote.volume != null && (
                <div>
                  <span className="text-muted-foreground">거래량</span>
                  <p className="font-semibold">{quote.volume.toLocaleString()}</p>
                </div>
              )}
              {quote.timestamp && (
                <div>
                  <span className="text-muted-foreground">시각</span>
                  <p className="font-semibold">{quote.timestamp.replace("T", " ").slice(0, 19)}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* #44 — WEM (주간 예상 움직임) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>주간 예상 움직임 (WEM)</span>
            <Button
              size="sm"
              variant="outline"
              disabled={refreshWemLoading || wemLoading}
              onClick={handleRefreshWem}
              className="cursor-pointer transition-colors duration-200"
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${refreshWemLoading ? "animate-spin" : ""}`}
              />
              WEM 새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(wemError || refreshWemError) && (
            <p className="text-destructive text-sm">{wemError || refreshWemError}</p>
          )}
          {!wem && !wemLoading && !wemError && (
            <p className="text-muted-foreground text-sm">WEM 데이터가 없습니다.</p>
          )}
          {wem && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">예상 High</span>
                <p className="font-semibold text-green-500">${wem.expected_move_high.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">예상 Low</span>
                <p className="font-semibold text-red-500">${wem.expected_move_low.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">예상 변동폭</span>
                <p className="font-semibold">{wem.expected_move_pct.toFixed(1)}%</p>
              </div>
              {wem.expiry_date && (
                <div>
                  <span className="text-muted-foreground">기준 만기</span>
                  <p className="font-semibold">{wem.expiry_date}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* #44 — Sigma 새로고침 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={refreshSigmaLoading}
          onClick={handleRefreshSigma}
          className="cursor-pointer transition-colors duration-200"
        >
          <RefreshCw
            className={`h-4 w-4 mr-1 ${refreshSigmaLoading ? "animate-spin" : ""}`}
          />
          Sigma 새로고침
        </Button>
        {refreshSigmaError && (
          <span className="text-destructive text-sm self-center">{refreshSigmaError}</span>
        )}
      </div>

      {/* #44 — 분석 결과 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>분석</span>
            <Button
              size="sm"
              variant="outline"
              disabled={analysisLoading}
              onClick={fetchLatest}
              className="cursor-pointer transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${analysisLoading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisError && <p className="text-destructive text-sm">{analysisError}</p>}
          {!analysis && !analysisLoading && !analysisError && (
            <p className="text-muted-foreground text-sm">분석 결과가 없습니다.</p>
          )}
          {analysis && (
            <div className="space-y-2 text-sm">
              {analysis.signal && (
                <p>
                  <span className="text-muted-foreground">Signal: </span>
                  <span className={`font-semibold ${signalColor(analysis.signal)}`}>
                    {analysis.signal}
                  </span>
                </p>
              )}
              {analysis.score != null && (
                <p>
                  <span className="text-muted-foreground">Score: </span>
                  <span className="font-semibold">{analysis.score}</span>
                </p>
              )}
              {analysis.summary && (
                <p className="text-muted-foreground whitespace-pre-wrap">{analysis.summary}</p>
              )}
              {analysis.recommendation && (
                <p className="text-muted-foreground">추천: {analysis.recommendation}</p>
              )}
              {analysis.data_date && (
                <p className="text-xs text-muted-foreground">기준일: {analysis.data_date}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meta */}
      <div className="text-xs text-muted-foreground">
        데이터 기준일: {report.data_date}
        {sigmaLoading && <span className="ml-2">(시그마 데이터 로딩 중...)</span>}
      </div>
    </div>
  );
}
