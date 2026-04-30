import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020408",
        foreground: "#FFFFFF",
        sana: {
          DEFAULT: "hsl(var(--sana) / <alpha-value>)",
          glow: "rgba(163, 255, 0, 0.5)",
        },
        democracy: {
          DEFAULT: "#3B82F6",
          glow: "rgba(59, 130, 246, 0.5)",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          glow: "rgba(139, 92, 246, 0.5)",
        },
        alert: "#EF4444",
        success: "#10B981",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "from": { "box-shadow": "0 0 10px -5px var(--tw-shadow-color)" },
          "to": { "box-shadow": "0 0 20px 5px var(--tw-shadow-color)" },
        }
      },
    },
  },
  plugins: [],
};
export default config;
