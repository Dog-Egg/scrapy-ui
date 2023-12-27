import Button from "@/components/Button";
import { getAllNodes } from "@/db";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import NodeItem from "./NodeItem";
import Link from "next/link";

export default async function NodesPage() {
  const nodes = await getAllNodes();

  return (
    <div>
      <header className=" flex justify-between border-b border-tertiary py-6">
        <div className="ml-auto">
          <Link href={"/nodes/add"}>
            <Button className="min-w-56" icon={<PlusCircleIcon />}>
              Add Node
            </Button>
          </Link>
        </div>
      </header>
      <main>
        {nodes.map((node) => (
          <NodeItem key={node.url} nodeURL={node.url}></NodeItem>
        ))}
      </main>
    </div>
  );
}
