"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KalBonusItem } from "../types";

interface KalBonusCardProps {
  item: KalBonusItem;
}

const DISPLAY_KEYS = ["account", "member", "mileage", "bonus", "status", "updated_at"];

const LABELS: Record<string, string> = {
  account: "계정",
  member: "회원",
  mileage: "마일리지",
  bonus: "보너스",
  status: "상태",
  updated_at: "갱신",
};

function formatValue(key: string, value: unknown) {
  if (typeof value === "number") return value.toLocaleString();
  if (key === "updated_at" && typeof value === "string") return value.replace("T", " ").slice(0, 19);
  return String(value);
}

export function KalBonusCard({ item }: KalBonusCardProps) {
  const keys = DISPLAY_KEYS.filter((k) => item[k] !== undefined);
  const extras = Object.keys(item).filter(
    (k) => !DISPLAY_KEYS.includes(k) && item[k] !== undefined,
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{item.member || item.account || "KAL 보너스"}</span>
          {item.status && (
            <Badge variant="outline" className="text-xs">{item.status}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {keys.map((k) => (
            <div key={k}>
              <span className="text-muted-foreground">{LABELS[k] ?? k}</span>
              <p className="font-semibold">{formatValue(k, item[k])}</p>
            </div>
          ))}
          {extras.map((k) => (
            <div key={k}>
              <span className="text-muted-foreground">{k}</span>
              <p className="font-semibold">{formatValue(k, item[k])}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
