import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Jobs", link: "/jobs" },
  { label: "Projects", link: "/projects" },
  { label: "Settings", link: "/settings" },
];

export function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item, index) => (
        <Link
          key={index}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground",
            pathname.startsWith(item.link) ? "" : "text-muted-foreground",
          )}
          href={item.link}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
