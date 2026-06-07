"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { ArxivPaper } from "../types";

interface ArxivCardProps {
  paper: ArxivPaper;
}

function formatAuthors(authors: string[]): string {
  if (authors.length > 3) {
    return `${authors.slice(0, 3).join(", ")} et al.`;
  }
  return authors.join(", ");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function ArxivCard({ paper }: ArxivCardProps) {
  return (
    <a
      href={paper.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold">{paper.title}</CardTitle>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {paper.authors.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {formatAuthors(paper.authors)}
            </p>
          )}
          {paper.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {paper.summary}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1">
            {paper.categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDate(paper.published_at)}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
