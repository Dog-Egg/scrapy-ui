import { getEnabledNodes } from "@/db";
import Main from "./main";

export default async function SpidersPage() {
  const nodes = await getEnabledNodes();
  return <Main nodes={nodes}></Main>;
}
