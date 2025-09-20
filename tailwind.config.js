/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285f4',
          dark: '#3367d6',
        },
        sidebar: {
          from: '#4285f4',
          to: '#3367d6'
        }
      }
    },
  },
  plugins: [],
}