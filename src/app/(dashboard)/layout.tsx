import Menu from "@/components/Menu";
import MenuItem from "@/components/MenuItem";
import {
  ServerStackIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  BugAntIcon,
} from "@heroicons/react/24/outline";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen">
      <aside className="h-full border-r border-r-secondary">
        <Menu
          title="ScrapyUI"
          footer={
            <>
              <MenuItem
                label="Settings"
                icon={<Cog6ToothIcon />}
                to="/settings"
              />
            </>
          }
        >
          <MenuItem label="Nodes" icon={<ServerStackIcon />} to="/nodes" />
          <MenuItem label="Jobs" icon={<ListBulletIcon />} to="/jobs" />
          <MenuItem label="Spiders" icon={<BugAntIcon />} to="/spiders" />
        </Menu>
      </aside>
      <div className="flex-grow px-8">{children}</div>
    </main>
  );
}
