/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './auth.tsx'],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
  plugins: [],
};
