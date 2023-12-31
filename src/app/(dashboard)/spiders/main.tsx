"use client";
import { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import SelectionPanel from "./SelectionPanel";
import {
  delproject,
  delversion,
  listprojects,
  listspiders,
  listversions,
} from "@/actions";
import {
  TrashIcon,
  PlayIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Modal from "@/components/Modal";

export default function Main({ nodes }: { nodes: ScrayUI.Node[] }) {
  // nodes
  const [selectedNodeURL, setSelectedNodeURL] = useState<string>();
  // projects
  const [projects, setProjects] = useState<string[]>();
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
  const [versionsMsg, setVersionsMsg] = useState("Loading...");
  const [selectedVersion, setSelectedVersion] = useState<string>();

  async function handleSelectNodeURL(url: string) {
    setSelectedNodeURL(url);

    fetchProjects(url);
  }

  async function handleSelectProject(project: string) {
    setSelectedProject(project);

    if (showVersionPanel) {
      if (selectedNodeURL) {
        fetchVersions(selectedNodeURL, project);
      }
    }

    if (selectedNodeURL) {
      fetchSpiders(selectedNodeURL, project);
    }
  }

  async function handleShowVersionPanel() {
    setShowVersionPanel(true);
    if (selectedNodeURL && selectedProject) {
      fetchVersions(selectedNodeURL, selectedProject);
    }
  }

  async function handleSelectVersion(version: string) {
    setSelectedVersion(version);
    if (selectedNodeURL && selectedProject) {
      await fetchSpiders(selectedNodeURL, selectedProject, version);
    }
  }

  async function fetchSpiders(url: string, project: string, version?: string) {
    clearSpiders();
    setSpiderPanelMsg("Loading...");

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
    <div className="flex h-96 px-10 *:mr-3 *:w-0 *:shrink *:basis-0 last:*:mr-0 odd:*:grow-[2] even:*:grow-[1]">
      <SelectionPanel
        title="Nodes"
        options={nodeOptions}
        onSelect={handleSelectNodeURL}
        selected={selectedNodeURL}
      />
      <Arrow></Arrow>
      <SelectionPanel
        title="Projects"
        emptyText={projectPanelMsg}
        options={projects}
        selected={selectedProject}
        onSelect={handleSelectProject}
        actions={[
          {
            label: "Delete this project",
            icon: <TrashIcon />,
            onClick(option) {
              Modal.confirm({
                title: "Delete Confirmation",
                message: `Are you sure you want to delete project "${option}"?`,
                confirmButtonText: "Delete",
              }).then(() => {
                if (selectedNodeURL) {
                  clearProjects();
                  setProjectPanelMsg("Deleting...");

                  delproject(selectedNodeURL, option).then(() => {
                    fetchProjects(selectedNodeURL);
                  });
                }
              });
            },
          },
        ]}
      />

      {showVersionPanel ? (
        <>
          <Arrow></Arrow>
          <SelectionPanel
            title="Versions"
            emptyText={versionsMsg}
            options={versions}
            selected={selectedVersion}
            onSelect={handleSelectVersion}
            actions={[
              {
                label: "Delete this version",
                icon: <TrashIcon />,
                onClick(option) {
                  Modal.confirm({
                    title: "Delete Confirmation",
                    message: `Are you sure you want to delete version "${option}"?`,
                    confirmButtonText: "Delete",
                  }).then(() => {
                    if (selectedNodeURL && selectedProject) {
                      clearVersions();
                      setVersionsMsg("Deleting...");
                      delversion(selectedNodeURL, selectedProject, option).then(
                        () => {
                          fetchVersions(selectedNodeURL, selectedProject);
                        },
                      );
                    }
                  });
                },
              },
            ]}
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
        options={spiders}
        emptyText={spiderPanelMsg}
        actions={[
          {
            label: "Schedule this spider",
            icon: <PlayIcon />,
          },
        ]}
      />
    </div>
  );

  async function fetchProjects(url: string) {
    clearProjects();
    setProjectPanelMsg("Loading...");

    try {
      const projects = await listprojects(url);
      if (projects.length) {
        setProjects(projects);
        setProjectPanelMsg("Project loading completed.");
      } else {
        setProjectPanelMsg("No available project.");
      }
    } catch (e) {
      if (e instanceof Error) {
        setProjectPanelMsg(e.message);
      }
    }
  }

  async function fetchVersions(url: string, project: string) {
    clearVersions();
    setVersionsMsg("Loading...");
    try {
      const versions = (await listversions(url, project)).reverse();
      if (versions.length) {
        setVersions(versions);
        setSelectedVersion(versions[0]);
        setVersionsMsg("Version loading completed.");
      } else {
        setVersionsMsg("No available version.");
      }
    } catch (e) {
      if (e instanceof Error) {
        setVersionsMsg(e.message);
      }
    }
  }

  function clearProjects() {
    setProjects([]);
    setSelectedProject(undefined);

    setShowVersionPanel(false);
    clearVersions();

    clearSpiders();
  }

  function clearVersions() {
    setVersions([]);
    setSelectedVersion(undefined);
  }

  function clearSpiders() {
    setSpiders([]);
    setSpiderPanelMsg("Please select a project first.");
  }
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
