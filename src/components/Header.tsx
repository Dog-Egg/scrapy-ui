import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
}
export default function Header(props: Props) {
  return (
    <header className=" mb-12 flex items-center justify-between border-b border-secondary py-6">
      <h2 className=" text-4xl font-semibold">{props.title}</h2>
      <div className="ml-auto">{props.children}</div>
    </header>
  );
}
