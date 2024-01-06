import { PropsWithChildren } from "react";
import MenuItem from "./MenuItem";

/**
 * 需要用于 Server Component
 */
function Menu({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

Menu.Item = MenuItem;

export default Menu;
