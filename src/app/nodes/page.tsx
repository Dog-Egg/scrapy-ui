"use client";

import Button from "@/components/Button";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Nodes() {
  const router = useRouter();
  return (
    <div>
      <header className=" border-tertiary flex justify-between border-b py-6">
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
    </div>
  );
}
