"use client";

import { cn } from "@/lib/utils";
import {
  Select as Root,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { forwardRef } from "react";

type Option<T> = { label: string; value: T };

interface Props<T> {
  options: Option<T>[];
  onChange?(value: T): unknown;
  placeholder?: string;
  defaultValue?: T;
  className?: string;
  value?: string;
}

const Select = forwardRef(function ({
  options,
  placeholder,
  defaultValue,
  onChange,
  className,
  value,
}: Props<string>) {
  return (
    <Root defaultValue={defaultValue} onValueChange={onChange} value={value}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem value={option.value} key={index}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Root>
  );
});
Select.displayName = "Select";

export default Select;
