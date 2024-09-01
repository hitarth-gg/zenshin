/* eslint-disable import/no-anonymous-default-export */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui"],
      inter: ["Inter", "ui-sans-serif", "system-ui"],
      "space-mono": ["Space Mono", "ui-sans-serif", "system-ui"],
    },
    extend: {
    },
  },
  plugins: [require("tailwindcss-animated", "@tailwindcss/line-clamp")],
};
