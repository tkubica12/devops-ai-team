/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
          primary: {
              50: '#F0F9FF',
              100: '#E0F2FE',
              200: '#BAE6FD',
              300: '#7DD3FC',
              400: '#38BDF8',
              500: '#0EA5E9',
              600: '#0284C7',
              700: '#0369A1',
              800: '#075985',
              900: '#0C4A6E',
            }
        }
    }
  },
  plugins: [],
}
