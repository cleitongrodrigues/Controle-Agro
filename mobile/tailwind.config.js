/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        agro: {
          green: "#1B4332",
          crop: "#2D6A4F",
          gold: "#D4A373",
        }
      }
    },
  },
  plugins: [],
}