import { apiGet } from "@/shared/lib/api-client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await apiGet(`/api/news/${id}`);
  return Response.json(data);
}
