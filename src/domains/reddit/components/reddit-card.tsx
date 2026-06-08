"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, MessageSquare, ExternalLink } from "lucide-react";
import type { RedditPost } from "../types";

interface RedditCardProps {
  post: RedditPost;
}

export function RedditCard({ post }: RedditCardProps) {
  const content = (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{post.title}</CardTitle>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.subreddit}</Badge>
          <span className="text-xs text-muted-foreground">{post.author}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-3.5 w-3.5" />
            {post.score}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {post.num_comments}
          </span>
        </div>
        {post.selftext && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.selftext}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (post.url) {
    return (
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}
