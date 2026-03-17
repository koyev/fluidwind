import fluidwind from "fluidwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  safelist: [
    { pattern: /^fw-(bg|text)-\[#/ },
  ],
  plugins: [fluidwind({ remBase: 16 })],
  theme: {
    fluidwind: {
      defaultRange: ["375px", "1440px"],
      ranges: {
        narrow: ["320px", "768px"],
        wide: ["768px", "1920px"],
        post: ["600px", "1000px"],
      },
    },
  },
};
