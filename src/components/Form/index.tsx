import classNames from "classnames";
import { PropsWithChildren } from "react";

interface FormProps extends PropsWithChildren {
  className?: string;
}

function Form({ children, className }: FormProps) {
  return (
    <form
      className={classNames(className)}
      onSubmit={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      {children}
    </form>
  );
}

interface FormItemProps extends PropsWithChildren {
  label?: string;
}

function FormItem({ children, label }: FormItemProps) {
  return (
    <div className="mb-6">
      {label && (
        <label className="mb-2 block text-sm font-normal">{label}</label>
      )}
      {children}
    </div>
  );
}

Form.Item = FormItem;
export default Form;
