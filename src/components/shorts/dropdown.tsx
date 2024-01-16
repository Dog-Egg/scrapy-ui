import { PropsWithChildren, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props<T> extends PropsWithChildren {
  menu: {
    label: ReactNode;
    key?: T;
  }[];
  onClickMenuItem?(options: { key?: T; index: number }): void;
}

export default function Dropdown<T>({
  menu,
  onClickMenuItem,
  ...props
}: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {menu.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onClickMenuItem?.({ key: item.key, index })}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
