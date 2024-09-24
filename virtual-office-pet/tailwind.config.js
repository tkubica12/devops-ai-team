/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode using a class
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Specify the paths to all templates
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#121212',
          text: '#e0e0e0',
        },
        light: {
          background: '#ffffff',
          text: '#222222',
        },
      },
    },
  },
  plugins: [],
}
