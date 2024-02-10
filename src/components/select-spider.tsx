import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCurrentNode } from "./node-provider";
import { listspiders } from "@/client/scrapyd-api";

export function SpiderSelect({
  project,
  version,
  onValueChange,
  className,
}: {
  project?: string;
  version?: string;
  onValueChange?(value: string): void;
  className?: string;
}) {
  const [spiders, setSpiders] = useState<string[]>();
  const currentNode = useCurrentNode();

  useEffect(() => {
    setSpiders(undefined);
    if (currentNode && project) {
      listspiders(currentNode?.url, project, version).then(setSpiders);
    }
  }, [project, version, currentNode]);

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {spiders ? (
          spiders.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))
        ) : (
          <div className="py-1 text-center text-xs text-muted-foreground">
            {project === undefined
              ? "You need to select a project"
              : "Loading..."}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
