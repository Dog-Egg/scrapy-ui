"use server";

import { addNode, getNodeByAddress } from "@/db";

export async function POST(request: Request) {
  const data: ScrayUI.Node = await request.json();
  if (getNodeByAddress(data.address)) {
    return Response.json(
      {
        fieldErrors: { address: "Address already exists." },
      },
      { status: 400 },
    );
  }
  addNode(data);
  return new Response();
}
