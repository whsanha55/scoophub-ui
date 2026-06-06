import { apiPut, apiDelete } from "@/shared/lib/api-client";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const data = await apiPut(`/api/stock/watchlist/${id}`, body);
  return Response.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await apiDelete(`/api/stock/watchlist/${id}`);
  return Response.json(data);
}
