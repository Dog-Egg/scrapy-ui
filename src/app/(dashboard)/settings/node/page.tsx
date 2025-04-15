"use client";

import { useCurrentNode } from "@/components/node-provider";
import Button from "@/components/shorts/button";
import * as Message from "@/components/shorts/message";
import { deleteNodeByUrl } from "@/actions/db";

export default function Page() {
  const currentNode = useCurrentNode();

  return (
    <div>
      <Button
        variant="destructive"
        onClick={() => {
          Message.confirm({
            title: "确定要删除吗？",
            description: `此操作将删除节点 "${
              currentNode ? new URL(currentNode?.url).host : "未知"
            }"。`,
          }).then(() => {
            if (currentNode) {
              deleteNodeByUrl(currentNode?.url).then(() => {
                window.location.href = "/";
              });
            }
          });
        }}
      >
        删除节点
      </Button>
    </div>
  );
}
