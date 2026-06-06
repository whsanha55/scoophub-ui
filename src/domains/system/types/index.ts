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
  response: string;
}
