import { apiGet, apiPost } from "@/shared/lib/api-client";

export async function GET() {
  const data = await apiGet("/api/stock/watchlist");
  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await apiPost("/api/stock/watchlist", body);
  return Response.json(data);
}
