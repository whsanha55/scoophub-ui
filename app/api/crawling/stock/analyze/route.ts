import { apiPost } from "@/shared/lib/api-client";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string | number | boolean | undefined> = {};
  if (searchParams.get("tickers")) params.tickers = searchParams.get("tickers")!;

  const data = await apiPost("/api/crawling/stock/analyze");
  return Response.json(data);
}
