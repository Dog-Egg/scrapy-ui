import pkg from "../../package.json";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex w-full space-x-4 border-t bg-background px-4 py-1">
      <span className="ml-auto text-xs text-muted-foreground">
        Version: {pkg.version}
        {process.env.NODE_ENV === "development" && "-dev"}
      </span>
      <a href="https://github.com/Dog-Egg/scrapy-ui">
        <GitHubLogoIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
