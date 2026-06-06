import { apiGet } from "@/shared/lib/api-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: Record<string, string | number | boolean | undefined> = {};
  if (searchParams.get("tickers")) params.tickers = searchParams.get("tickers")!;
  if (searchParams.get("timeframe")) params.timeframe = searchParams.get("timeframe")!;

  const data = await apiGet("/api/stock/report", params);
  return Response.json(data);
}
