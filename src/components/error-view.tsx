import { ReactNode, useEffect, useState } from "react";
import Button from "./shorts/button";

export function ErrorView({ children }: { children: ReactNode }) {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    instances.push(setIsError);

    return () => {
      const index = instances.findIndex((item) => Object.is(item, setIsError));
      instances.splice(index, 1);
    };
  }, []);

  if (isError) {
    return (
      <div className="m-auto flex items-center">
        <p className="text-2xl">The Node is offline.</p>
        <Button className="ml-4" onClick={() => setIsError(false)}>
          Retry
        </Button>
      </div>
    );
  } else {
    return children;
  }
}

const instances: Array<(val: boolean) => void> = [];

export const setError = () => {
  instances.forEach((fn) => {
    fn(true);
  });
};
