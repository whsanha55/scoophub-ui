import { apiGet } from "@/shared/lib/api-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: Record<string, string | number | boolean | undefined> = {
    location: searchParams.get("location") || "seoul",
  };
  if (searchParams.get("minutes")) params.minutes = searchParams.get("minutes")!;
  if (searchParams.get("from")) params.from = searchParams.get("from")!;
  if (searchParams.get("to")) params.to = searchParams.get("to")!;

  const data = await apiGet("/api/weather", params);
  return Response.json(data);
}
