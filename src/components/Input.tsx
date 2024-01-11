import { ReactNode, useContext, useEffect, useState } from "react";
import { FormItemContext } from "./Form";

interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  type?: "url" | "text";
  suffixIcon?: ReactNode;
}

function Input({ type = "text", ...props }: Props) {
  const { defaultValue } = props;

  const formItem = useContext(FormItemContext);
  const [internalValue, setInteralValue] = useState(defaultValue);

  useEffect(() => {
    formItem?.setValue(internalValue);
  }, [internalValue, formItem]);

  return (
    <div className="flex items-center rounded-md border border-primary p-3 group-[.is-error]:border-danger">
      <input
        className="outline-none placeholder:text-secondary"
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
