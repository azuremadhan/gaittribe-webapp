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
        "background-primary": "#0B1220",
        "background-secondary": "#0F172A",
        "card-bg": "#111827",
        "accent-primary": "#1E90FF",
        "accent-glow": "#00C2FF",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "border-soft": "rgba(255,255,255,0.08)",
        brand: {
          50: "#15243f",
          100: "#203154",
          500: "#1E90FF",
          600: "#00C2FF",
          700: "#1874d1",
        },
        accent: {
          500: "#1E90FF",
          600: "#00C2FF",
        },
        highlight: {
          500: "#1E90FF",
          600: "#00C2FF",
        },
        surface: "#111827",
        ink: "#F1F5F9",
        muted: "#94A3B8",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.4)",
        lift: "0 15px 40px rgba(0, 0, 0, 0.5)",
        glow: "0 10px 25px rgba(0, 194, 255, 0.3)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-bar": {
          "0%": { opacity: "0.75" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.75" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out",
        "reveal-up": "reveal-up 0.6s ease-out both",
        "pulse-bar": "pulse-bar 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
