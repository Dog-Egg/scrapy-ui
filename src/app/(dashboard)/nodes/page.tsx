"use client";

import Button from "@/components/Button";
import { getAllNodes } from "@/db";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Nodes() {
  const router = useRouter();
  const nodes = getAllNodes();

  return (
    <div>
      <header className=" flex justify-between border-b border-tertiary py-6">
        <div className="ml-auto">
          <Button
            className="min-w-56"
            icon={<PlusCircleIcon />}
            onClick={() => {
              router.push("/nodes/add");
            }}
          >
            Add Node
          </Button>
        </div>
      </header>
      <main>
        {nodes.map((node) => (
          <div
            key={node.address}
            className="mx-auto mt-8 w-2/3 rounded-xl border border-[transparent] bg-tertiary p-4 hover:border-secondary"
          >
            <div className="text-base text-secondary">
              <span>{node.address}</span>
              <span className="ml-1">(node_name)</span>
            </div>

            {/* 分隔线 */}
            <div className="my-2 border-b border-dashed border-secondary"></div>

            <div className="flex justify-around py-3">
              <div className="group cursor-pointer">
                <span className="text-5xl font-medium">2</span>
                <span className="ml-2 align-super text-lg">running</span>
              </div>
              <div>
                {/* <span className="text-5xl font-medium">3</span> */}
                <span className="text-5xl font-light">--</span>
                <span className=" ml-2 align-super text-lg">pending</span>
              </div>
              <div>
                <span className="text-5xl font-medium">25</span>
                <span className=" ml-2 align-super text-lg">finished</span>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
