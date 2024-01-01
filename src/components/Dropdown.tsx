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
}

export default function Dropdown(props: Props) {
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

  const referenceProps: any = getReferenceProps();

  return (
    <>
      <div
        ref={refs.setReference}
        {...referenceProps}
        onClick={(e) => {
          e.stopPropagation();
          referenceProps.onClick?.(e);
        }}
      >
        {props.children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div className="cursor-auto rounded border border-secondary bg-white p-1 text-primary">
            {props.menu.map((item, index) => (
              <div
                key={index}
                className="min-w-32 cursor-pointer rounded px-2 py-1 text-sm hover:bg-tertiary "
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
