import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", ...fontFamily.sans],
        sans: ["DM Sans", ...fontFamily.sans],
        mono: ['"Fira Code"', ...fontFamily.mono],
      },
      colors: {
        bg: "#0c0c0e",
        surface: "#141416",
        surface2: "#1e1e22",
        border: "#2a2a30",
        "accent-hover": "#22d3ee",
        accent: "color-mix(in srgb, var(--accent) 95%, transparent)",
        "accent-dim": "rgba(34,211,238,0.10)",
        orange: "#fb923c",
        muted: "#8888a0",
        text: "#f0f0f4",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
