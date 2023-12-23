"use client";

import { PropsWithChildren, ReactNode } from "react";
import classNames from "classnames";

interface Props extends PropsWithChildren {
  type?: "primary";
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
  block?: boolean;
  disabled?: boolean;
}

function Button(props: Props) {
  const { children, type = "primary", className } = props;

  return (
    <button
      className={classNames([
        "button",
        `button-${type}`,
        className,
        props.block && "w-full",
        "disabled:bg-secondary",
      ])}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div className={classNames("flex items-center justify-center")}>
        {props.icon && <i className="mr-[10px] block h-6 w-6">{props.icon}</i>}
        {children}
      </div>
    </button>
  );
}

export default Button;
