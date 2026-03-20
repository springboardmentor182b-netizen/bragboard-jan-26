/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#213555',
        secondary: '#3E5879',
        accent: '#D8C4B6',
        background: '#F5EFE7',
      }
    },
  },
  plugins: [],
}
