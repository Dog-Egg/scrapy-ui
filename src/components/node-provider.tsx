import type { Node } from "@/db";
import { createContext, useContext } from "react";

export const NodeContext = createContext<Node | null>(null);

export function useCurrentNode() {
  return useContext(NodeContext);
}
