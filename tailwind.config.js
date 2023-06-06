/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      newsletter: ["Sabon", "Times New Roman", "Times", "Georgia", "Serif"],
    },
    extend: {},
  },
  plugins: [],
}
