import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#667080",
      secondary: "#9BA5B7",
      tertiary: "#EEF1F4",
      white: "#FFFFFF",
      danger: "#F62C2C",
      annotations: "#F6BE2C",
    },
  },
  plugins: [],
};
export default config;
