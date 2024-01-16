"use client";

import { listprojects } from "@/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCurrentNode } from "./node-provider";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

export function ProjectSelect({
  onValueChange,
  className,
}: {
  className?: string;
  onValueChange?(value: string): void;
}) {
  const currentNode = useCurrentNode();

  const [projects, setProjects] = useState<string[] | undefined>(undefined);
  useEffect(() => {
    if (currentNode) {
      listprojects(currentNode?.url).then(setProjects);
    }
  }, [currentNode]);

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {projects ? (
          projects.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))
        ) : (
          <div className="flex items-center justify-center py-1 text-center text-xs text-muted-foreground">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
            Loading...
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
