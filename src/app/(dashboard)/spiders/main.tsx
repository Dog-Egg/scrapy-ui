"use client";
import { useEffect, useMemo, useState } from "react";
import SelectionPanel from "./SelectionPanel";
import { listprojects, listspiders } from "@/actions";

export default function Main({ nodes }: { nodes: ScrayUI.Node[] }) {
  const [selectedNodeURL, setSelectedNodeURL] = useState<string>();
  const [projects, setProjects] = useState<string[]>();

  const [projectPanelMsg, setProjectPanelMsg] = useState(
    "Please select a node first.",
  );
  useEffect(() => {
    // 选择的节点更新时，获取节点中的项目列表
    if (!selectedNodeURL) return;
    (async () => {
      try {
        setProjects(await listprojects(selectedNodeURL));
      } catch (e) {
        // 从节点获取项目列表失败，清空项目列表
        setProjects([]);

        if (e instanceof Error) {
          setProjectPanelMsg(e.message);
        }
      }
    })();
  }, [selectedNodeURL]);

  const [selectedProject, setSelectedProject] = useState<string>();
  const [spiders, setSpiders] = useState<string[]>();
  useEffect(() => {
    if (!selectedNodeURL || !selectedProject) return;
    (async () => {
      try {
        setSpiders(await listspiders(selectedNodeURL, selectedProject));
      } catch {
        setSpiders([]);
      }
    })();
  }, [selectedProject, selectedNodeURL]);

  const nodeOptions = useMemo(() => nodes.map((n) => n.url), [nodes]);
  return (
    <div className=" grid grid-cols-3 gap-24">
      <SelectionPanel
        title="Nodes"
        options={nodeOptions}
        onSelect={(option) => {
          setSelectedNodeURL(option);
        }}
      />
      <SelectionPanel
        title="Projects"
        emptyText={projectPanelMsg}
        options={projects}
        onSelect={(option) => {
          setSelectedProject(option);
        }}
      />
      <SelectionPanel
        title="Spiders"
        selectable={false}
        options={spiders}
        emptyText="Please select a project first."
      />
    </div>
  );
}
