import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        mayera: {
          cream: "#F1ECE6",
          paper: "#FBF8F3",
          sand: "#DED4C3",
          olive: "#77734E",
          espresso: "#1F1A17",
          amber: "#8B4A2A",
          line: "#D7CEC1"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 26, 23, 0.08)",
        card: "0 12px 32px rgba(31, 26, 23, 0.06)"
      },
      letterSpacing: {
        luxury: "0.22em"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  },
  plugins: []
};

export default config;
