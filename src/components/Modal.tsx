import { PropsWithChildren, ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Button from "./Button";
import { CheckIcon } from "@heroicons/react/16/solid";

interface Props extends PropsWithChildren {
  footer?: ReactNode;
}

export default function Modal({ children, footer }: Props) {
  return (
    <div className="fixed left-1/2 top-1/3 z-50 -translate-x-1/2">
      <div className="m-auto min-w-96 rounded-2xl border border-secondary bg-white">
        <div className="p-8">{children}</div>
        {footer && <div className="p-4">{footer}</div>}
      </div>
    </div>
  );
}

Modal.confirm = ({
  message,
  title,
  confirmButtonText = "Confirm",
}: {
  message?: string;
  title?: string;
  confirmButtonText?: string;
}) => {
  let domNode = document.getElementById("message-container");
  if (!domNode) {
    domNode = document.createElement("div");
    domNode.setAttribute("id", "message-container");
    document.body.appendChild(domNode);
  }

  const root = createRoot(domNode);

  return new Promise((resolve, reject) => {
    const component = (
      <StrictMode>
        <Modal
          footer={
            <div className="flex *:grow *:basis-0">
              <Button type="tertiary" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onConfirm} suffixIcon={<CheckIcon />}>
                {confirmButtonText}
              </Button>
            </div>
          }
        >
          <div className="mb-2 text-2xl font-bold">{title}</div>
          <div className="font-normal text-primary">{message}</div>
        </Modal>
        {/* overlay */}
        <div className="fixed bottom-0 left-0 right-0 top-0 z-10 bg-secondary opacity-10"></div>
      </StrictMode>
    );
    root.render(component);

    function onConfirm() {
      resolve(undefined);
    }
    function onCancel() {
      reject();
    }
  }).finally(() => {
    root.unmount();
  });
};
