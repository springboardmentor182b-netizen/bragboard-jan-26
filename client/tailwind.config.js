/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#213555',
        secondary: '#F5EFE7',
        accent1: '#3E5879',
        accent2: '#D8C4B6',
      }
    },
  },
  plugins: [],
}
