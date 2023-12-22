interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
}

function Input(props: Props) {
  return (
    <input
      className="block w-full rounded-md border border-primary px-3 py-3 outline-none placeholder:text-tertiary group-[.is-error]:border-danger"
      type="text"
      placeholder={props.placeholder}
      onChange={(e) => {
        const value = e.target.value;
        props.onChange && props.onChange(value);
      }}
      defaultValue={props.defaultValue}
    />
  );
}

export default Input;
