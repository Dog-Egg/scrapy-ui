import { getEnabledNodes } from "@/db";
import Main from "./main";
import Header from "@/components/Header";

export default async function SpidersPage() {
  const nodes = await getEnabledNodes();
  return (
    <div>
      <Header title="Spiders"></Header>
      <Main nodes={nodes}></Main>
    </div>
  );
}
