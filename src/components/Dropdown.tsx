import {
  useFloating,
  useInteractions,
  useClick,
  autoPlacement,
  useDismiss,
} from "@floating-ui/react";
import { PropsWithChildren, ReactNode, useState } from "react";

interface Props extends PropsWithChildren {
  menu: {
    label: ReactNode;
    key?: string;
    icon?: ReactNode;
  }[];
  onSelect?: (key: string | number) => void;
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
          className="z-10"
        >
          <div className="cursor-auto overflow-hidden rounded border border-secondary bg-white text-primary">
            {props.menu.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setIsOpen(false);
                  props.onSelect?.(item.key ?? index);
                }}
                className="min-w-32 cursor-pointer whitespace-nowrap px-3 py-2 text-sm hover:bg-tertiary"
              >
                <div className="flex items-center">
                  {item.icon && (
                    <span className="mr-2 w-[1.25em]">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
