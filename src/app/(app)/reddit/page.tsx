"use client";

import { useEffect, useRef, useState } from "react";
import { useReddit, useRedditCrawl } from "@/domains/reddit/hooks/use-reddit";
import { RedditCard } from "@/domains/reddit/components/reddit-card";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SORT_OPTIONS = [
  { value: "score" as const, label: "인기순" },
  { value: "created_at" as const, label: "최신순" },
];

type Sort = "score" | "created_at";

export default function RedditPage() {
  const { posts, loading, fetchPosts } = useReddit();
  const { loading: crawlLoading, triggerCrawl } = useRedditCrawl();

  const [sort, setSort] = useState<Sort>("score");
  const [subreddit, setSubreddit] = useState("");
  const [debouncedSubreddit, setDebouncedSubreddit] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSubreddit(subreddit), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [subreddit]);

  useEffect(() => {
    fetchPosts({ subreddit: debouncedSubreddit || undefined, sort, order: "desc", limit: 25 });
  }, [sort, debouncedSubreddit, fetchPosts]);

  const handleCrawl = async () => {
    await triggerCrawl();
    await fetchPosts({ subreddit: debouncedSubreddit || undefined, sort, order: "desc", limit: 25 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reddit</h1>
        <CrawlTriggerButton
          onClick={handleCrawl}
          loading={crawlLoading}
          label="크롤 수집"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={sort === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSort(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <Input
          className="sm:w-60"
          placeholder="서브레딧 필터 (예: programming)"
          aria-label="서브레딧 필터"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <RedditCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          포스트가 없습니다
        </div>
      )}
    </div>
  );
}
