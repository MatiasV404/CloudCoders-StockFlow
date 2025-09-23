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
        }
      },
      spacing: {
        '15': '3.75rem',   // min-w-15
        '70': '17.5rem',   // w-70
      },
      minWidth: {
        '6': '1.5rem',     // min-w-6  
        '8': '2rem',       // min-w-8
        '9': '2.25rem',    // min-w-9
        '10': '2.5rem',    // min-w-10
        '15': '3.75rem',   // min-w-15
      }
    },
  },
  plugins: [],
}