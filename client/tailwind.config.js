/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F97316', // Main orange
        'brand-dark': '#D97706',   // Darker shade
        'brand-yellow': '#EAB308', // Lighter/Yellow shade
        'brand-light-bg': '#FFFBF0',
      }
    },
  },
  plugins: [],
}
