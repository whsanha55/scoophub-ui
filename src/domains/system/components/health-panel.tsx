"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useHealth } from "../hooks/use-health";

export function HealthPanel() {
  const { health, loading, error, fetchHealth } = useHealth();

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">서비스 상태</h2>
        <Button variant="outline" size="sm" onClick={fetchHealth} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-1" />
          새로고침
        </Button>
      </div>

      {loading && !health && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {!loading && !error && !health && (
        <p className="text-muted-foreground text-sm">헬스 정보를 불러올 수 없습니다</p>
      )}

      {health && (
        <>
          <div className="flex items-center gap-2">
            <Badge variant={health.status === "ok" ? "default" : "destructive"}>
              {health.status === "ok" ? "정상" : "오류"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(health.total_records).map(([table, count]) => (
              <Card key={table}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm text-muted-foreground">{table}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">{count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">총 레코드 수</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
