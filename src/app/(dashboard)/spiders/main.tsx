"use client";
import { PropsWithChildren, useMemo, useState } from "react";
import SelectionPanel from "./SelectionPanel";
import { listprojects, listspiders, listversions } from "@/actions";
import {
  TrashIcon,
  PlayIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function Main({ nodes }: { nodes: ScrayUI.Node[] }) {
  // nodes
  const [selectedNodeURL, setSelectedNodeURL] = useState<string>();
  // projects
  const [projects, _setProjects] = useState<string[]>();
  const [projectPanelMsg, setProjectPanelMsg] = useState(
    "Please select a node first.",
  );
  const [selectedProject, setSelectedProject] = useState<string>();
  // spiders
  const [spiders, setSpiders] = useState<string[]>();
  const [spiderPanelMsg, setSpiderPanelMsg] = useState(
    "Please select a project first.",
  );
  // versions
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const [versions, setVersions] = useState<string[]>();

  async function handleSelectNodeURL(url: string) {
    setSelectedNodeURL(url);

    setProjects([]);
    setSelectedProject(undefined);

    setProjectPanelMsg("Loading...");
    try {
      setProjects(await listprojects(url));
      setProjectPanelMsg("Project loading completed");
    } catch (e) {
      if (e instanceof Error) {
        setProjectPanelMsg(e.message);
      }
    }
  }

  function setProjects(projects: string[]) {
    _setProjects(projects);

    setShowVersionPanel(false);
    setVersions([]);

    setSpiders([]);
    setSpiderPanelMsg("Please select a project first.");
  }

  async function handleSelectProject(project: string) {
    setSelectedProject(project);

    setSpiders([]);

    if (selectedNodeURL) {
      await fetchSpiders(selectedNodeURL, project);
    }
  }

  async function handleShowVersionPanel() {
    setShowVersionPanel(true);
    if (selectedNodeURL && selectedProject) {
      const versions = await listversions(selectedNodeURL, selectedProject);
      setVersions(versions.reverse());
    }
  }

  async function handleSelectVersion(version: string) {
    if (selectedNodeURL && selectedProject) {
      await fetchSpiders(selectedNodeURL, selectedProject, version);
    }
  }

  async function fetchSpiders(url: string, project: string, version?: string) {
    setSpiders([]);
    setSpiderPanelMsg("Loading");

    try {
      setSpiders(await listspiders(url, project, version));
    } catch (e) {
      if (e instanceof Error) {
        setSpiderPanelMsg(e.message);
      }
    }
  }

  const nodeOptions = useMemo(() => nodes.map((n) => n.url), [nodes]);
  return (
    <div className="flex h-96 px-10 *:mr-3 *:w-0 *:shrink *:basis-0 last:*:mr-0 odd:*:grow-[4] even:*:grow-[3]">
      <SelectionPanel
        title="Nodes"
        options={nodeOptions}
        onSelect={handleSelectNodeURL}
      />
      <Arrow></Arrow>
      <SelectionPanel
        title="Projects"
        emptyText={projectPanelMsg}
        options={projects}
        onSelect={handleSelectProject}
        moreActions={[
          {
            label: (
              <div className="flex items-center">
                <TrashIcon width={"1.25em"} className="mr-2" />
                Delete this project
              </div>
            ),
          },
        ]}
      />

      {showVersionPanel ? (
        <>
          <Arrow></Arrow>
          <SelectionPanel
            title="Versions"
            emptyText="Loading..."
            options={versions}
            defaultActive={versions?.[0]}
            onSelect={handleSelectVersion}
          />
          <Arrow></Arrow>
        </>
      ) : (
        <Arrow>
          {selectedProject && (
            <div
              className="flex cursor-pointer items-center rounded-md border border-primary px-2 py-1"
              onClick={handleShowVersionPanel}
            >
              latest
              <ChevronDownIcon className="ml-1 text-secondary" width={"1em"} />
            </div>
          )}
        </Arrow>
      )}
      <SelectionPanel
        title="Spiders"
        selectable={false}
        options={spiders}
        emptyText={spiderPanelMsg}
        moreActions={[
          {
            label: (
              <div className="flex items-center">
                <PlayIcon width={"1.25em"} className="mr-2" />
                Schedule this spider
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function Arrow({ children }: PropsWithChildren) {
  return (
    <div className="relative my-auto">
      <div className="border-annotations w-full border-b-[1.5px]"></div>
      <ChevronRightIcon
        className="text-annotations absolute right-0 top-0 -translate-y-[46%] translate-x-[39%]"
        width={"1.25em"}
        height={"1.25em"}
      />
      {children && (
        <div className=" absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-white p-1 text-primary">
          {children}
        </div>
      )}
    </div>
  );
}
