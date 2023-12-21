import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Menu from "@/components/Menu";
import MenuItem from "@/components/MenuItem";
import { ServerStackIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scrapy UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex h-screen">
          <aside className="border-r-secondary h-full border-r">
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
      </body>
    </html>
  );
}
