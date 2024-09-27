/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#007bff',
        'custom-dark-blue': '#0056b3',
      },
    },
  },
  plugins: [],
}
