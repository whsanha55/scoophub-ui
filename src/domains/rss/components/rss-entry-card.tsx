"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { RssEntry } from "../types";

interface RssEntryCardProps {
  entry: RssEntry;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 30) return `${diffDays}일 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

export function RssEntryCard({ entry }: RssEntryCardProps) {
  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold line-clamp-2">
              {entry.title}
            </CardTitle>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {entry.author && (
            <p className="text-sm text-muted-foreground">{entry.author}</p>
          )}
          {entry.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {entry.summary}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDate(entry.published_at)}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
