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
  errorMsg?: string;
}

function FormItem({ children, label, errorMsg }: FormItemProps) {
  return (
    <div className="relative mb-6">
      {label && (
        <label className="mb-2 block text-sm font-normal">{label}</label>
      )}
      {children}
      {errorMsg && (
        <span className="text-danger absolute -bottom-5 left-0 text-xs">
          {errorMsg}
        </span>
      )}
    </div>
  );
}

Form.Item = FormItem;
export default Form;
