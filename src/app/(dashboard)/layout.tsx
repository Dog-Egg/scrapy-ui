import Menu from "@/components/Menu";
import {
  ServerStackIcon,
  ListBulletIcon,
  BugAntIcon,
} from "@heroicons/react/24/outline";
import { headers } from "next/headers";

const menuItems = [
  { label: "Nodes", link: "/nodes", icon: <ServerStackIcon /> },
  { label: "Jobs", link: "/jobs", icon: <ListBulletIcon /> },
  { label: "Spiders", link: "/spiders", icon: <BugAntIcon /> },
];

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname");

  return (
    <div className="flex h-screen">
      <aside className="flex h-full min-w-64 flex-col border-r border-r-secondary p-4 pt-0 *:grow first:*:grow-0">
        <h1 className="py-6 text-center text-4xl font-semibold">ScrapyUI</h1>
        <Menu>
          {menuItems.map((item, index) => (
            <Menu.Item
              key={index}
              label={item.label}
              icon={item.icon}
              link={item.link}
              active={pathname === item.link}
            />
          ))}
        </Menu>
      </aside>
      <main className="flex-grow px-8">{children}</main>
    </div>
  );
}
