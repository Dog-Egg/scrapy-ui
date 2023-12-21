"use client";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  label: string;
  icon?: ReactNode;
  to: string;
}

export default function MenuItem(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname == props.to;

  return (
    <div
      className="relative flex cursor-pointer items-center justify-between py-4 pl-4 pr-2"
      onClick={() => {
        router.push(props.to);
      }}
    >
      <div className="flex items-center">
        {props.icon && <span className="mr-6 h-5 w-5">{props.icon}</span>}
        <span>{props.label}</span>
      </div>
      <ChevronRightIcon className="text-secondary h-4 w-4" />
      {active && (
        <div className="bg-tertiary absolute left-0 top-0 -z-10 h-full w-full rounded-lg"></div>
      )}
    </div>
  );
}
