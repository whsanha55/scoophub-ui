"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import type { RssFeed } from "../types";

interface RssFeedManagerProps {
  feeds: RssFeed[] | null;
  loading: boolean;
  onAdd: (params: { name: string; url: string }) => void;
  onDelete: (id: number) => void;
}

export function RssFeedManager({
  feeds,
  loading,
  onAdd,
  onDelete,
}: RssFeedManagerProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onAdd({ name: name.trim(), url: url.trim() });
    setName("");
    setUrl("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="피드 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-40"
        />
        <Input
          placeholder="RSS URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!name.trim() || !url.trim()}>
          추가
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">로딩 중...</p>
      ) : feeds && feeds.length > 0 ? (
        <ul className="space-y-2">
          {feeds.map((feed) => (
            <li
              key={feed.id}
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium truncate">{feed.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {feed.url}
                </span>
                <Badge variant={feed.active ? "default" : "outline"}>
                  {feed.active ? "활성" : "비활성"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(feed.id)}
                className="shrink-0 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 피드가 없습니다</p>
      )}
    </div>
  );
}
