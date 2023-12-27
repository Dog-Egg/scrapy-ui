export async function POST(
  request: Request,
  { params }: { params: { api: string } },
) {
  const { api } = params;
  const req = await request.json();
  if (api === "daemonstatus.json") {
    const url = new URL(api, req.url);
    const res = await fetch(url, { method: "GET" });
    return Response.json(await res.json());
  }
  return new Response("<h1>Forbidden API</h1>", {
    status: 403,
    headers: { "Content-Type": "text/html" },
  });
}
