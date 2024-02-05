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

  const lines = content.split("\n");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-scroll text-sm">
          <ol className="list-decimal space-y-1 marker:text-muted-foreground">
            {lines.map((line, index) => (
              <li
                key={index}
                style={{
                  marginLeft: lines.length.toString().length + "em",
                }}
              >
                {line}
              </li>
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
});

FileContentViewer.displayName = "FileContentViewer";
