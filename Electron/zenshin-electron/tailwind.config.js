/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui'],
      inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      'space-mono': ['Space Mono', 'ui-sans-serif', 'system-ui']
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      lg2: '1152px',

      xl: '1380px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1836px'
      // => @media (min-width: 1536px) { ... }
    },
    boxShadow: {
      '3xl': '90 35px 60px -15px rgba(0, 0, 0, 0.8)'
    },
    extend: {}
  },
  plugins: [require('tailwindcss-animated', '@tailwindcss/line-clamp')]
}
