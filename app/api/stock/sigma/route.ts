import { apiGet } from "@/shared/lib/api-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");
  if (!ticker) {
    return Response.json({ success: false, error: { code: "MISSING_PARAM", message: "ticker is required" } }, { status: 400 });
  }
  const data = await apiGet("/api/stock/sigma", { ticker });
  return Response.json(data);
}
