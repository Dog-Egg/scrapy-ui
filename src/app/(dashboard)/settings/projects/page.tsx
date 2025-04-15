"use client";

import { ProjectSelect } from "@/components/select-project";
import Button from "@/components/shorts/button";
import { Label } from "@/components/ui/label";
import { VersionSelect } from "@/components/select-version";
import { useState } from "react";
import { delproject } from "@/client/scrapyd-api";
import { useCurrentNode } from "@/components/node-provider";

export default function Page() {
  const [project, setProject] = useState<string>();
  const [version, setVersion] = useState<string>();

  const currentNode = useCurrentNode();

  return (
    <div className="space-y-8">
      {/* project */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="space-y-2">
            <span>项目</span>
            <ProjectSelect onValueChange={setProject} />
          </Label>
          <Description>选择上传到节点的项目。</Description>
        </div>
        <Button
          variant="destructive"
          disabled={!project}
          onClick={() => {
            if (currentNode && project) {
              delproject(currentNode?.url, project);
            }
          }}
        >
          删除项目
        </Button>
      </div>

      {/* version */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="space-y-2">
            <span>版本</span>
            <VersionSelect project={project} onValueChange={setVersion} />
          </Label>
        </div>
        <Button variant="destructive" disabled={!version}>
          删除版本
        </Button>
      </div>
    </div>
  );
}

function Description({ children }: { children?: string }) {
  return <p className="text-[0.8rem] text-muted-foreground">{children}</p>;
}
