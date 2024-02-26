import type { DBNode } from "@/utils/types";
import { createContext, useContext } from "react";

export const NodeContext = createContext<DBNode | null>(null);

export function useCurrentNode() {
  return useContext(NodeContext);
}
