import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodeForm, NodeFormHandle } from "@/components/node-form";
import { addNode } from "@/db";
import { useRef, useState } from "react";
import Button from "./shorts/button";
import type { Node } from "@/db";

export function NodeFormDialog({
  open: openDialog,
  setOpen: setOpenDialog,
  onAddSuccessful,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddSuccessful: (node: Node) => void;
}) {
  // add form
  const formRef = useRef<NodeFormHandle>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
        </DialogHeader>
        <NodeForm
          ref={formRef}
          onSubmit={(values) => {
            setSaveLoading(true);
            addNode(values)
              .then((res) => {
                if (res.ok) {
                  setOpenDialog(false);
                  onAddSuccessful(res.data);
                } else {
                  formRef.current?.setError("url", {
                    type: "manual",
                    message: res.message,
                  });
                }
              })
              .finally(() => {
                setSaveLoading(false);
              });
          }}
        ></NodeForm>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              formRef.current?.requestSubmit();
            }}
            loading={saveLoading}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
