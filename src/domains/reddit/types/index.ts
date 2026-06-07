export interface RedditPost {
  id: number;
  title: string;
  url: string;
  permalink: string | null;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  selftext: string | null;
  thumbnail_url: string | null;
  fetched_at: string;
  created_at: string;
}

export interface RedditParams {
  subreddit?: string;
  sort?: "score" | "created_at";
  order?: "desc" | "asc";
  limit?: number;
  page?: number;
}
