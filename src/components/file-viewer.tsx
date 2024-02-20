import { useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Button from "./shorts/button";
import { Button as Button2 } from "./ui/button";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DownloadIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type FileViewerProps = {
  content: string;
  title: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  refreshLoading?: boolean;
};

export const FileViewer = function ({
  content,
  title,
  open,
  onOpenChange,
  showRefreshButton = false,
  refreshLoading = false,
  onRefresh,
}: FileViewerProps) {
  const lines = content.trim().split("\n");
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // 内容变更时滑动到底部
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] max-w-[90vw] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll text-sm" ref={containerRef}>
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
        <DialogFooter>
          <Button
            size="icon"
            icon={<ArrowUpIcon />}
            variant={"dashed"}
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          />
          <Button
            size="icon"
            icon={<ArrowDownIcon />}
            variant={"dashed"}
            onClick={scrollToBottom}
          />
          {showRefreshButton && (
            <Button2
              size="icon"
              variant={"dashed"}
              disabled={refreshLoading}
              onClick={onRefresh}
            >
              <UpdateIcon className={cn(refreshLoading && "animate-spin")} />
            </Button2>
          )}
          <Button
            variant={"dashed"}
            icon={<DownloadIcon />}
            size="icon"
            onClick={() => {
              const file = new Blob([content]);
              const link = document.createElement("a");
              const url = URL.createObjectURL(file);
              link.href = url;
              link.download = `${title}_${new Date()
                .toISOString()
                .substring(0, 10)
                .replaceAll("-", "")}.txt`;
              link.click();

              URL.revokeObjectURL(url);
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
