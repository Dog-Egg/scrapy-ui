import { forwardRef, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export type FileContentViewerHandle = {
  render(props: { title: string; content: string }): void;
};

export const FileContentViewer = forwardRef<FileContentViewerHandle>(function (
  {}: {},
  ref,
) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useImperativeHandle(ref, () => {
    return {
      render({ title, content }) {
        setTitle(title);
        setContent(content);
        setOpen(true);
      },
    };
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-scroll text-xs">
          <pre>{content}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
});

FileContentViewer.displayName = "FileContentViewer";
