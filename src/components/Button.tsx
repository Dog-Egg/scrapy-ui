import { PropsWithChildren, ReactNode } from "react";
import classNames from "classnames";

interface Props extends PropsWithChildren {
  type?: "primary" | "secondary" | "outline" | "dashed";
  icon?: ReactNode;
  suffixIcon?: ReactNode;
  onClick?: () => void;
  block?: boolean;
  disabled?: boolean;
}

function Button({ children, type = "primary", ...props }: Props) {
  return (
    <button
      data-button
      className={classNames([
        "cursor-pointer rounded-md px-4 py-3 text-base font-semibold", // button common
        type == "primary" && "bg-primary text-white",
        type == "secondary" && "bg-tertiary text-primary",
        type == "outline" &&
          "text-primary outline outline-2 -outline-offset-2 outline-primary",
        type == "dashed" &&
          "!font-normal outline-dashed outline-1 -outline-offset-1 outline-primary",
        props.block && "w-full",
        "disabled:bg-secondary",
        "[&+&]:ml-4",
      ])}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className={classNames("flex items-center justify-center")}>
        {props.icon && <i className="mr-[10px] block h-6 w-6">{props.icon}</i>}
        <span>{children}</span>
        {props.suffixIcon && (
          <i className="ml-[10px] block h-6 w-6">{props.suffixIcon}</i>
        )}
      </div>
    </button>
  );
}

export default Button;
