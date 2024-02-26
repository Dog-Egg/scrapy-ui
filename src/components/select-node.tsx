import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectSeparator,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { ServerStackIcon } from "@heroicons/react/24/outline";
import type { DBNode } from "@/utils/types";

export function NodeSelect({
  loading,
  value,
  nodes,
  onValueChange,
  onAddNode,
}: {
  loading: boolean;
  value: string;
  nodes: DBNode[];
  onValueChange: (value: string) => void;
  onAddNode: () => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => {
        if (value === "add") {
          onAddNode();
        } else {
          onValueChange(value);
        }
      }}
    >
      <SelectTrigger className="w-[12rem]">
        <div className="flex items-center overflow-hidden [&>span]:overflow-hidden [&>span]:text-ellipsis">
          {loading ? (
            <ReloadIcon className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ServerStackIcon className="mr-2 h-5 w-5 flex-shrink-0" />
          )}
          <SelectValue placeholder="Select a node" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {nodes.map((node) => (
          <SelectItem key={node.url} value={node.url}>
            {new URL(node.url).host}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value="add">
          <div className="flex items-center">
            <PlusCircledIcon className="mr-2 h-5 w-5" />
            Add Node
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
