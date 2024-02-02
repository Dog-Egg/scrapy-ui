import { Button as Root, ButtonProps } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ReactElement, cloneElement, forwardRef } from "react";

interface Props extends ButtonProps {
  icon?: ReactElement;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(function (
  { loading = false, children, icon, ...props }: Props,
  ref,
) {
  return (
    <Root
      ref={ref}
      {...props}
      className={cn(props.className, "[&+&]:ml-2")}
      disabled={props.disabled || loading}
    >
      {props.asChild ? (
        children
      ) : (
        <>
          {/* icon */}
          {icon &&
            cloneElement(icon, {
              className: cn("h-4 w-4", children && "mr-2"),
            })}

          {/* children */}
          {children}
        </>
      )}
    </Root>
  );
});

Button.displayName = "Button";

export default Button;
