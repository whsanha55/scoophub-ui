import { apiPost } from "@/shared/lib/api-client";

export async function POST() {
  const data = await apiPost("/api/crawling/stock/sigma");
  return Response.json(data);
}
