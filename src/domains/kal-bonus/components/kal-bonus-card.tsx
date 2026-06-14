"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KalBonusItem } from "../types";
import { CABIN_ORDER } from "../types";

interface KalBonusRouteCardProps {
  item: KalBonusItem;
}

const CABIN_SHORT: Record<string, string> = {
  "일반석 보너스": "일반석",
  "프레스티지석 보너스": "프레스티지",
  "일등석 보너스/좌석승급": "일등석",
  "프레스티지석 좌석승급": "승급",
};

function fmtDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(6, 8)}`;
}

export function KalBonusRouteCard({ item }: KalBonusRouteCardProps) {
  const { parsed } = item;
  const days = parsed?.days ?? [];

  // 해당 루트에 등장하는 유형만 추출(고정 순서 유지)
  const cabinSet = new Set<string>();
  days.forEach((d) => d.flights.forEach((f) => cabinSet.add(f.cabin_label)));
  const cabins = CABIN_ORDER.filter((c) => cabinSet.has(c));

  // 유형별 가용 요약(월 내 전체 일자 기준)
  const summary = cabins.map((cabin) => {
    let ok = 0;
    let total = 0;
    days.forEach((d) =>
      d.flights.forEach((f) => {
        if (f.cabin_label === cabin) {
          total += 1;
          if (f.available) ok += 1;
        }
      }),
    );
    return { cabin, ok, total };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="font-semibold">{parsed.departure}</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-semibold">{parsed.arrival}</span>
          </span>
          <div className="flex flex-wrap gap-1">
            {summary.map(({ cabin, ok, total }) => (
              <Badge
                key={cabin}
                variant={ok > 0 ? "default" : "secondary"}
                className="text-[10px]"
                title={cabin}
              >
                {CABIN_SHORT[cabin] ?? cabin}: {ok}/{total}
              </Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left font-medium pr-2 py-1">날짜</th>
                {cabins.map((c) => (
                  <th key={c} className="text-center font-medium px-1 py-1 whitespace-nowrap">
                    {CABIN_SHORT[c] ?? c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const byCabin = new Map(
                  day.flights.map((f) => [f.cabin_label, f.available]),
                );
                return (
                  <tr key={day.date} className="border-t border-border">
                    <td className="pr-2 py-1 font-medium whitespace-nowrap">
                      {fmtDate(day.date)}
                    </td>
                    {cabins.map((c) => {
                      const avail = byCabin.get(c);
                      return (
                        <td key={c} className="text-center px-1 py-1">
                          {avail === undefined ? (
                            <span className="text-muted-foreground">-</span>
                          ) : avail ? (
                            <span className="text-green-500 font-bold">●</span>
                          ) : (
                            <span className="text-muted-foreground/40">○</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
