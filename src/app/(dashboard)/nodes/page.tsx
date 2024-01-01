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
        <Link href={"/nodes/add"}>
          <Button className="min-w-56" icon={<PlusCircleIcon />}>
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
