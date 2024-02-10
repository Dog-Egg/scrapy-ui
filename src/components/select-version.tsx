import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { listversions } from "@/client/scrapyd-api";
import { useCurrentNode } from "./node-provider";

export function VersionSelect({
  project,
  onValueChange,
  placeholder,
  className,
}: {
  project?: string;
  placeholder?: string;
  onValueChange?(value: string): void;
  className?: string;
}) {
  const [versions, setVersions] = useState<string[]>();
  const currentNode = useCurrentNode();

  function handleOpenChange(open: boolean) {
    if (open && versions == undefined && project && currentNode) {
      listversions(currentNode?.url, project).then((data) =>
        setVersions(data.reverse()),
      );
    }
  }

  useEffect(() => {
    setVersions(undefined);
  }, [project, currentNode]);

  return (
    <Select onOpenChange={handleOpenChange} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {versions ? (
          versions.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))
        ) : (
          <div className="py-1 text-center text-xs text-muted-foreground">
            {project === undefined
              ? "You need to select a project."
              : "Loading..."}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
