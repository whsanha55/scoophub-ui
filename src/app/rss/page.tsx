"use client";

import { useEffect, useState } from "react";
import { useRssEntries, useRssFeeds, useRssCrawl } from "@/domains/rss/hooks/use-rss";
import { RssEntryCard } from "@/domains/rss/components/rss-entry-card";
import { RssFeedManager } from "@/domains/rss/components/rss-feed-manager";
import { CrawlTriggerButton } from "@/domains/news/components/crawl-trigger-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type SortOption = "published_at" | "fetched_at";

export default function RssPage() {
  const { entries, loading: entriesLoading, fetchEntries } = useRssEntries();
  const { feeds, loading: feedsLoading, fetchFeeds, addFeed, deleteFeed } = useRssFeeds();
  const { loading: crawlLoading, triggerCrawl } = useRssCrawl();

  const [selectedFeedId, setSelectedFeedId] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<SortOption>("published_at");

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  useEffect(() => {
    fetchEntries({
      feed_id: selectedFeedId,
      sort,
      order: "desc",
      limit: 50,
    });
  }, [selectedFeedId, sort, fetchEntries]);

  const handleCrawl = async () => {
    await triggerCrawl();
    await fetchEntries({
      feed_id: selectedFeedId,
      sort,
      order: "desc",
      limit: 50,
    });
    await fetchFeeds();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">RSS Feeds</h1>

      <RssFeedManager
        feeds={feeds}
        loading={feedsLoading}
        onAdd={addFeed}
        onDelete={deleteFeed}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1">
          <Button
            variant={selectedFeedId === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFeedId(undefined)}
          >
            전체
          </Button>
          {feeds?.map((feed) => (
            <Button
              key={feed.id}
              variant={selectedFeedId === feed.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFeedId(feed.id)}
            >
              {feed.name}
            </Button>
          ))}
        </div>
        <div className="flex gap-1">
          <Button
            variant={sort === "published_at" ? "default" : "outline"}
            size="sm"
            onClick={() => setSort("published_at")}
          >
            최신순
          </Button>
          <Button
            variant={sort === "fetched_at" ? "default" : "outline"}
            size="sm"
            onClick={() => setSort("fetched_at")}
          >
            수집순
          </Button>
        </div>
        <div className="sm:ml-auto">
          <CrawlTriggerButton
            onClick={handleCrawl}
            loading={crawlLoading}
            label="크롤 수집"
          />
        </div>
      </div>

      {entriesLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {entries.map((entry) => (
            <RssEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          엔트리가 없습니다
        </div>
      )}
    </div>
  );
}
