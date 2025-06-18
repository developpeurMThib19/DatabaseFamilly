/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f3ede1',
        leaf: '#A8C3A0',
        smoke: '#7D8CA3',
        terracotta: '#D99C83',
        forest: '#324B3A',
      },
      fontFamily: {
        serif: ['"Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
