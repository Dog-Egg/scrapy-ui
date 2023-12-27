import { HTMLInputTypeAttribute, useContext, useEffect, useState } from "react";
import { FormItemContext } from "./Form";

interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  type?: HTMLInputTypeAttribute;
}

function Input(props: Props) {
  const { defaultValue } = props;

  const formItem = useContext(FormItemContext);
  const [internalValue, setInteralValue] = useState(defaultValue);

  useEffect(() => {
    formItem?.setValue(internalValue);
  }, [internalValue, formItem]);

  return (
    <input
      className="block w-full rounded-md border border-primary px-3 py-3 outline-none placeholder:text-tertiary group-[.is-error]:border-danger"
      type={props.type}
      placeholder={props.placeholder}
      onChange={(e) => {
        const value = e.target.value;
        setInteralValue(value);
        props.onChange && props.onChange(value);
      }}
      defaultValue={props.defaultValue}
    />
  );
}

export default Input;
