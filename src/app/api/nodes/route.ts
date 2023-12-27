"use server";

import { addNode, getNodeByURL } from "@/db";

export async function POST(request: Request) {
  const data: ScrayUI.Node = await request.json();
  if (await getNodeByURL(data.url)) {
    return Response.json(
      {
        fieldErrors: { address: "URL already exists." },
      },
      { status: 400 },
    );
  }
  await addNode(data);
  return new Response();
}
