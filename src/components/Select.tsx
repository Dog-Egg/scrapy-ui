import { useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import classNames from "classnames";
import { useFormField } from "./Form";

type Option<T> = { label: string; value: T };

export default function Select<T>({
  options,
  onChange,
  placeholder,
}: {
  options: Option<T>[];
  onChange?: (value: T) => unknown;
  placeholder?: string;
}) {
  // floating
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  //
  const [selectedOption, setSelectedOption] = useState<Option<T>>();

  const formField = useFormField();

  return (
    <div className="relative">
      {/* select main */}
      <div
        className={classNames(
          "cursor-pointer p-3",
          !isOpen &&
            "rounded-md border border-primary group-[.is-error]:border-danger",
          isOpen && "rounded-t-md border border-primary border-b-tertiary",
        )}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="flex items-center">
          {selectedOption ? (
            <span>{selectedOption.label}</span>
          ) : (
            // placeholder
            <span className="text-secondary">{placeholder}</span>
          )}
          <ChevronUpDownIcon className="ml-auto w-6" />
        </div>
      </div>

      {/* options */}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-10 w-full overflow-hidden rounded-b-md border-b border-l border-r border-primary bg-white"
        >
          {options.map((option) => (
            <div
              className="cursor-pointer p-3 hover:bg-tertiary"
              onClick={() => {
                setIsOpen(false);
                onChange?.(option.value);
                formField?.setValue(option.value);
                setSelectedOption(option);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
