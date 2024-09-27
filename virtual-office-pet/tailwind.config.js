/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Paths to components
    './public/index.html' // Path to index.html
  ],
  theme: {
    extend: {
      // Add any additional color customizations here if needed
    },
  },
  plugins: [
    // Add any Tailwind CSS plugins here if needed
  ],
}