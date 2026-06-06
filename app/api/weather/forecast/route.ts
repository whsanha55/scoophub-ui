import { apiGet } from "@/shared/lib/api-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: Record<string, string | number | boolean | undefined> = {
    location: searchParams.get("location") || "seoul",
  };
  if (searchParams.get("limit")) params.limit = searchParams.get("limit")!;

  const data = await apiGet("/api/weather/forecast", params);
  return Response.json(data);
}
