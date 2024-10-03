/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui'],
      inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      'space-mono': ['Space Mono', 'ui-sans-serif', 'system-ui']
    },
    extend: {}
  },
  plugins: [require('tailwindcss-animated', '@tailwindcss/line-clamp')]
}
