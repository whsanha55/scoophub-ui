import { apiGet } from "@/shared/lib/api-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: Record<string, string | number | boolean | undefined> = {};
  if (searchParams.get("period")) params.period = searchParams.get("period")!;
  if (searchParams.get("language")) params.language = searchParams.get("language")!;
  if (searchParams.get("limit")) params.limit = searchParams.get("limit")!;

  const data = await apiGet("/api/github-trending", params);
  return Response.json(data);
}
