const fluidwind = require("fluidwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
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
      fontSize: {
        sm:  ["14px", "18px"],
        md:  ["16px", "24px"],
        lg:  ["20px", "32px"],
        xl:  ["28px", "48px"],
        "2xl": ["36px", "64px"],
      },
      spacing: {
        xs: ["4px",  "8px"],
        sm: ["8px",  "16px"],
        md: ["16px", "32px"],
        lg: ["24px", "64px"],
      },
    },
  },
};
