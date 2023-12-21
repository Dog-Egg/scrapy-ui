import { PropsWithChildren } from "react";

function Card({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}

export default Card;
