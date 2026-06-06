import { apiGet } from "@/shared/lib/api-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: Record<string, string | number | boolean | undefined> = {};
  if (searchParams.get("minutes")) params.minutes = searchParams.get("minutes")!;
  if (searchParams.get("from")) params.from = searchParams.get("from")!;
  if (searchParams.get("to")) params.to = searchParams.get("to")!;
  if (searchParams.get("category")) params.category = searchParams.get("category")!;
  if (searchParams.get("min_importance")) params.min_importance = searchParams.get("min_importance")!;
  if (searchParams.get("limit")) params.limit = searchParams.get("limit")!;

  const data = await apiGet("/api/news", params);
  return Response.json(data);
}
