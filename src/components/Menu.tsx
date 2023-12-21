import { PropsWithChildren, ReactNode } from "react";

interface Props extends PropsWithChildren {
  title?: string;
  footer?: ReactNode;
}

export default function Menu({ title, children, footer }: Props) {
  return (
    <div className="flex h-full min-w-72 flex-col p-4">
      {title && (
        <h1 className=" pb-6 pt-2 text-center text-4xl font-semibold">
          {title}
        </h1>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-auto">
          <div className="bg-tertiary my-4 h-[1px]"></div>
          {footer}
        </div>
      )}
    </div>
  );
}
