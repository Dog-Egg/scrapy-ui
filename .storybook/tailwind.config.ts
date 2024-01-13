import { Config } from "tailwindcss";
import baseConfig from "../tailwind.config";

const config: Config = {
  ...baseConfig,
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{tsx,ts,mdx}",
  ],
};

export default config;
