import { ReactNode, useEffect, useState } from "react";
import { useFormField } from "./Form";

interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  type?: "url" | "text";
  suffixIcon?: ReactNode;
}

function Input({ type = "text", ...props }: Props) {
  const { defaultValue } = props;

  const formField = useFormField();
  const [internalValue, setInteralValue] = useState(defaultValue);

  useEffect(() => {
    formField?.setValue(internalValue);
  }, [internalValue]);

  return (
    <div className="flex items-center rounded-md border border-primary p-3 group-[.is-error]:border-danger">
      <input
        className="w-full leading-6 outline-none placeholder:text-secondary"
        type={type}
        placeholder={props.placeholder}
        onChange={(e) => {
          const value = e.target.value;
          setInteralValue(value);
          props.onChange && props.onChange(value);
        }}
        defaultValue={props.defaultValue}
      />
      {props.suffixIcon && <span className="ml-3 w-6">{props.suffixIcon}</span>}
    </div>
  );
}

export default Input;
