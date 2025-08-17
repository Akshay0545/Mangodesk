/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ required for toggling with a class
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
