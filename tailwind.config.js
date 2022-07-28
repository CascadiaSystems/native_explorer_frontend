/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E4E6EB',
        secondary: '#B0B3B8',
        grey: {
          dark: '#18191A',
          main: '#242526',
          light: '#3A3B3C'
        },
        blue: {
          main: '#1778F2'
        }
      },
      spacing: {
        '5%': '5%'
      }
    },
  },
  plugins: [],
}
