"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const links = [
  { label: "通用设置", link: "/settings/general" },
  { label: "项目", link: "/settings/projects" },
  { label: "上传项目", link: "/settings/upload" },
];

export default function Layout({ children }: PropsWithChildren) {
  const currentPathname = usePathname();
  return (
    <div className="flex">
      {/* menu */}
      <ul className="w-1/5 space-y-1">
        {links.map((item) => (
          <li key={item.link} className={cn()}>
            <Link
              className={cn(
                "inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                currentPathname === item.link
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-transparent hover:underline",
              )}
              href={item.link}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* body */}
      <div className="ml-12">{children}</div>
    </div>
  );
}
