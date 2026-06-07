"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { NewsletterArticle } from "../types";

interface NewsletterCardProps {
  article: NewsletterArticle;
}

function parseTags(tags: string[] | string | undefined): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try { return JSON.parse(tags); } catch { return []; }
  }
  return [];
}

export function NewsletterCard({ article }: NewsletterCardProps) {
  const tags = parseTags(article.tags);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold line-clamp-2">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{article.newsletter_name}</Badge>
            {article.author && (
              <span className="text-sm text-muted-foreground">
                {article.author}
              </span>
            )}
          </div>
          {article.summary && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {article.summary}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
