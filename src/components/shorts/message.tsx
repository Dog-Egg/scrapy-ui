"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Message({
  onCancel,
  onConfirm,
  title,
  description,
}: {
  title?: string;
  description?: string;
  onConfirm?(): void;
  onCancel?(): void;
}) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent onEscapeKeyDown={onCancel}>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function confirm({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  let container = document.getElementById("message-container");
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", "message-container");
    document.body.appendChild(container);
  }
  const root = createRoot(container);

  return new Promise<"confirm">((resolve, reject) => {
    root.render(
      <StrictMode>
        <Message
          title={title}
          description={description}
          onConfirm={() => {
            resolve("confirm");
          }}
          onCancel={() => {
            reject("cancel");
          }}
        />
        ,
      </StrictMode>,
    );
  }).finally(() => {
    setTimeout(() => {
      root.unmount();
    }, 300);
  });
}
