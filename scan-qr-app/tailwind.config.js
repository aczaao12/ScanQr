/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-bg': '#E0E5EC',
        'light-shadow': '#FFFFFF',
        'dark-shadow': '#A3B1C6',
      },
      boxShadow: {
        'neumo-sm': '3px 3px 6px #A3B1C6, -3px -3px 6px #FFFFFF',
        'neumo-sm-inset': 'inset 3px 3px 6px #A3B1C6, inset -3px -3px 6px #FFFFFF',
        'neumo': '6px 6px 12px #A3B1C6, -6px -6px 12px #FFFFFF',
        'neumo-inset': 'inset 6px 6px 12px #A3B1C6, inset -6px -6px 12px #FFFFFF',
      }
    },
  },
  plugins: [],
}