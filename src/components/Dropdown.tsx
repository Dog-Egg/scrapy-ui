import {
  useFloating,
  useInteractions,
  useClick,
  autoPlacement,
  useDismiss,
} from "@floating-ui/react";
import { PropsWithChildren, ReactNode, useState } from "react";

export type MenuProps = { label: ReactNode }[];

interface Props extends PropsWithChildren {
  menu: MenuProps;
  onSelect?: () => void;
}

export default function Dropdown<T>(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      autoPlacement({ allowedPlacements: ["bottom", "top", "bottom-end"] }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {props.children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div className="cursor-auto overflow-hidden rounded border border-secondary bg-white text-primary">
            {props.menu.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false);
                }}
                className="min-w-32 cursor-pointer whitespace-nowrap px-3 py-2 text-sm hover:bg-tertiary"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
