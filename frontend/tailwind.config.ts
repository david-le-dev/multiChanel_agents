import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101418",
        canvas: "#f5f0e8",
        ember: "#c75c2a",
        moss: "#44624a",
        sand: "#d8cbb8"
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        display: ["var(--font-fraunces)", "serif"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(16, 20, 24, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

