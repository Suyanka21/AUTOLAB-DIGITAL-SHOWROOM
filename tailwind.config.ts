import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0B",
        obsidian: "#0B0B0B",
        graphite: "#141416",
        surface: {
          50: "#141416",
          100: "#1A1A1E",
          200: "#222228",
        },
        border: "rgba(255, 255, 255, 0.08)",
        brand: {
          cyan: "#38B6FF",
          "cyan-glow": "rgba(56, 182, 255, 0.25)",
          gold: "#D4AF37",
          amber: "#C26829",
          obsidian: "#0B0B0B",
          graphite: "#141416",
        },
        accent: {
          sky: "#38B6FF",
          rose: "#F43F5E",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
