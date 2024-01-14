import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import classNames from "classnames";

interface Props extends PropsWithChildren {
  type?: "primary" | "secondary" | "outline" | "dashed";
  icon?: ReactNode;
  suffixIcon?: ReactNode;
  onClick?: () => void;
  block?: boolean;
  disabled?: boolean;
  htmlType?: ButtonHTMLAttributes<unknown>["type"];
  pill?: boolean;
}

function Button({
  htmlType,
  children,
  type = "primary",
  pill = false,
  ...props
}: Props) {
  return (
    <button
      type={htmlType}
      data-button
      className={classNames([
        "cursor-pointer font-semibold", // button common
        pill
          ? "rounded-full px-4 py-2 text-sm"
          : "rounded-md px-4 py-3 text-base",
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
