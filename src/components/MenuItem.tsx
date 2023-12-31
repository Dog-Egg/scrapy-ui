"use client";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  label: ReactNode;
  icon?: ReactNode;
  suffixIcon?: ReactNode | null;
  active?: boolean;
  link?: string;
  onClick?: () => void;
}

export default function MenuItem({
  active = false,
  suffixIcon = <ChevronRightIcon />,
  ...props
}: Props) {
  return (
    <ItemTag
      link={props.link}
      className="relative flex cursor-pointer items-center justify-between py-4 pl-4 pr-2"
      onClick={() => {
        props.onClick?.();
      }}
    >
      <div className="flex items-center overflow-hidden">
        {props.icon && <span className="mr-6 h-5 w-5">{props.icon}</span>}
        <span
          className={classNames(
            "overflow-hidden text-ellipsis whitespace-nowrap",
            // active && "font-semibold",
          )}
        >
          {props.label}
        </span>
      </div>

      {suffixIcon && (
        <span className="min-h-4 min-w-4 text-secondary">{suffixIcon}</span>
      )}

      {active && (
        <div className="absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-tertiary"></div>
      )}
    </ItemTag>
  );
}

function ItemTag({ link, ...props }: { link?: string } & any) {
  return link ? <a href={link} {...props}></a> : <div {...props}></div>;
}
