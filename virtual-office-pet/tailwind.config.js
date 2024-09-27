/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Paths to components
    './public/index.html', // Path to index.html
    './src/**/*.css' // Path to CSS files
  ],
  theme: {
    extend: {
      colors: {
        dark: '#444',
        header: '#282c34',
      },
    },
  },
  plugins: [],
}