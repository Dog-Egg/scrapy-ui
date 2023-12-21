interface Props {
  placeholder?: string;
  onChange?: (value: string) => void;
}

function Input(props: Props) {
  return (
    <input
      className="border-primary placeholder:text-secondary block w-full rounded-md border px-3 py-3 outline-none"
      type="text"
      placeholder={props.placeholder}
      onChange={(e) => {
        const value = e.target.value;
        props.onChange && props.onChange(value);
      }}
    />
  );
}

export default Input;
