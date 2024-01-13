import { useEffect, useState } from "react";
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
  defaultValue,
}: {
  options: Option<T>[];
  onChange?: (value: T) => unknown;
  placeholder?: string;
  defaultValue?: T;
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

  useEffect(() => {
    if (defaultValue !== undefined) {
      const option = options.find((option) => option.value == defaultValue);
      setSelectedOption(option);
    }
  }, []);

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
            <span
              className={classNames(isOpen ? "text-secondary" : "text-primary")}
            >
              {selectedOption.label}
            </span>
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
              className={classNames(
                "cursor-pointer p-3 hover:bg-tertiary",
                selectedOption === option && "bg-tertiary",
              )}
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
