export interface RssFeed {
  id: number;
  name: string;
  url: string;
  active: boolean;
  last_fetched_at: string | null;
  created_at: string;
}

export interface RssEntry {
  id: number;
  feed_id: number;
  title: string;
  url: string;
  author: string | null;
  summary: string | null;
  published_at: string;
  fetched_at: string;
}

export interface RssEntryParams {
  feed_id?: number;
  sort?: "published_at" | "fetched_at";
  order?: "desc" | "asc";
  limit?: number;
  page?: number;
}

export interface RssFeedCreateParams {
  name: string;
  url: string;
}
