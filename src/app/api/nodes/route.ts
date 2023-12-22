"use server";

import { addNode, getNodeByAddress } from "@/db";

export async function POST(request: Request) {
  const data: APIData.Node = await request.json();
  if (getNodeByAddress(data.address)) {
    return Response.json({
      status: "error",
      fieldErrors: { address: "Address already exists." },
    });
  }
  addNode(data);
  return Response.json({ status: "ok" });
}
