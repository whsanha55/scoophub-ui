export interface HealthData {
  status: "ok" | "error";
  total_records: Record<string, number>;
}

export interface CrawlLog {
  id: number;
  crawler: string;
  status: "success" | "error";
  items_fetched: number;
  items_new: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
  crawler_detail: string;
}

export interface CrawlLogsParams {
  crawler?: string;
  crawler_detail?: string;
  limit?: number;
}

export interface LLMTestRequest {
  message: string;
  system?: string;
}

export interface LLMTestResponse {
  model: string;
  content: string;
}

// #41 — crawl_schedule 런타임 관리
export interface CrawlSchedule {
  crawler: string;
  job_id: string;
  interval_seconds: number | null;
  cron_expr: string | null;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
}

export interface CrawlSchedulePatch {
  interval_seconds?: number | null;
  cron_expr?: string | null;
  is_active?: boolean;
}

// #42 — crawl_config 런타임 관리
export interface CrawlConfigEntry {
  crawler: string;
  params: Record<string, unknown>;
}

export type CrawlConfigPatch = Record<string, unknown>;
