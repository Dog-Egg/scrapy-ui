import Button from "@/components/Button";
import { getAllNodes } from "@/db";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import NodeItem from "./NodeItem";
import Link from "next/link";
import Header from "@/components/Header";

export default async function NodesPage() {
  const nodes = await getAllNodes();

  return (
    <div>
      <Header title="Nodes">
        <Link href={"/nodes/add"} className="block min-w-56">
          <Button block icon={<PlusCircleIcon />}>
            Add Node
          </Button>
        </Link>
      </Header>
      <main>
        {nodes.map((node) => (
          <NodeItem key={node.url} nodeURL={node.url}></NodeItem>
        ))}
      </main>
    </div>
  );
}
