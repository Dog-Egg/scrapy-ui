"use client";

import { useCurrentNode } from "@/components/node-provider";
import Button from "@/components/shorts/button";
import * as Message from "@/components/shorts/message";
import { deleteNodeByUrl } from "@/db";

export default function Page() {
  const currentNode = useCurrentNode();

  return (
    <div>
      <Button
        variant="destructive"
        onClick={() => {
          Message.confirm({
            title: "Are you sure?",
            description: `This will delete node "${
              currentNode ? new URL(currentNode?.url).host : "unknown"
            }".`,
          }).then(() => {
            if (currentNode) {
              deleteNodeByUrl(currentNode?.url).then(() => {
                window.location.href = "/";
              });
            }
          });
        }}
      >
        Delete Node
      </Button>
    </div>
  );
}
