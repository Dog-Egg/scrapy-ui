import Dropdown from "@/components/shorts/dropdown";
import Button from "./shorts/button";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <Dropdown
      onClickMenuItem={({ key }) => {
        setTheme(key!);
      }}
      menu={[
        { label: "Light", key: "light" },
        { label: "Dark", key: "dark" },
        { label: "System", key: "system" },
      ]}
    >
      <Button variant="ghost" size="icon">
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </Dropdown>
  );
}
