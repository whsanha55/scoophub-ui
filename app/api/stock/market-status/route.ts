import { apiGet } from "@/shared/lib/api-client";

export async function GET() {
  const data = await apiGet("/api/stock/market-status");
  return Response.json(data);
}
