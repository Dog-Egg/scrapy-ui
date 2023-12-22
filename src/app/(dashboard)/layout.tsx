import Menu from "@/components/Menu";
import MenuItem from "@/components/MenuItem";
import { ServerStackIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

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
        </Menu>
      </aside>
      <div className="flex-grow px-4">{children}</div>
    </main>
  );
}
