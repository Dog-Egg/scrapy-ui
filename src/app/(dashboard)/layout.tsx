"use client";

import { getAllNodes, Node } from "@/db";
import { useEffect, useMemo, useState } from "react";
import { NodeContext } from "@/components/node-provider";
import { NodeSelect } from "@/components/select-node";
import { ThemeToggle } from "@/components/theme-toggle";
import { NodeFormDialog } from "@/components/node-form-dialog";
import { HeaderNav } from "@/components/header-nav";
import Link from "next/link";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [nodesLoading, setNodesLoading] = useState(true);

  /**
   * open node adding form.
   */
  function openAddForm() {
    setOpenDialog(true);
  }

  async function fetchNodes() {
    setNodesLoading(true);
    try {
      const nodes = await getAllNodes();
      setNodes(nodes);
      return nodes;
    } finally {
      setNodesLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      const nodes = await fetchNodes();
      if (!nodes.length) {
        // 无任何节点时，打开添加表单
        openAddForm();
        return;
      }

      const stored = localStorage.getItem("currentNodeUrl");
      const storedNode = nodes.find((n) => n.url === stored);
      if (storedNode) {
        setSelectedUrl(storedNode.url);
      } else if (nodes.length) {
        setSelectedUrl(nodes[0].url);
      }
    })();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);

  const currentNode = useMemo(() => {
    if (selectedUrl) {
      const node = nodes.find((n) => n.url === selectedUrl);
      return node || null;
    }
    return null;
  }, [nodes, selectedUrl]);
  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/30">
        <h1 className="text-base font-bold">
          <Link href="/">ScrapyUI</Link>
        </h1>

        {/* nav */}
        <div className="mx-6">
          <HeaderNav />
        </div>

        {/* selecting node */}
        <div className="ml-auto flex items-center space-x-4">
          <NodeSelect
            nodes={nodes}
            loading={nodesLoading}
            value={selectedUrl}
            onValueChange={(value) => {
              setSelectedUrl(value);
              localStorage.setItem("currentNodeUrl", value);
            }}
            onAddNode={() => {
              openAddForm();
            }}
          />

          {/* tools */}
          <ThemeToggle />
        </div>
      </header>

      {/* main */}
      {currentNode ? (
        <NodeContext.Provider value={currentNode}>
          <main className="px-8 pb-8 pt-6">{children}</main>
        </NodeContext.Provider>
      ) : (
        <div className="m-auto text-center">
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to ScrapyUI
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Please select a node first.
          </p>
        </div>
      )}

      {/* adding node */}
      <NodeFormDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onAddSuccessful={fetchNodes}
      />
    </div>
  );
}
