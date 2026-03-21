/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wag: {
          DEFAULT: '#B8A490',
          dark: '#A08878',
          light: '#D4C8BC',
          subtle: '#EDE8E3',
        },
      },
    },
  },
  plugins: [],
};
