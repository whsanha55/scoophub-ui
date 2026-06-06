const API_URL = process.env.API_URL || "http://localhost:20010";

interface ApiErrorResponse {
  code: string;
  message: string;
  detail?: string | null;
  suggestion?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorResponse | null;
  meta: {
    requested_at: string;
    total?: number | null;
    returned?: number | null;
  };
}

class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export { ApiClientError };

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number = TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiCall<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    timeout?: number;
  } = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, params, timeout } = options;

  const url = new URL(path, API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const init: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      if (body) {
        init.body = JSON.stringify(body);
      }

      const response = await fetchWithTimeout(url.toString(), init, timeout);

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok || !data.success) {
        const errMsg =
          data.error?.message || `API error: ${response.status}`;
        throw new ApiClientError(
          response.status,
          data.error?.code || "UNKNOWN",
          errMsg,
        );
      }

      return data;
    } catch (err) {
      lastError = err as Error;

      // Don't retry client errors (4xx)
      if (err instanceof ApiClientError && err.status < 500) {
        throw err;
      }

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<ApiResponse<T>> {
  return apiCall<T>(path, { method: "GET", params });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiCall<T>(path, { method: "POST", body });
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiCall<T>(path, { method: "PUT", body });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiCall<T>(path, { method: "PATCH", body });
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return apiCall<T>(path, { method: "DELETE" });
}
