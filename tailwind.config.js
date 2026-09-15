/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#722770',
        secondary: '#551d54',
        tertiary: '#391338',
        base: '#1c0a1c',
      },
    },
  },
  plugins: [],
};
