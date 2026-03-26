/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': '#2d6a4f',
        'eco-light': '#d8f3dc',
        'eco-dark': '#081c15',
        'eco-accent': '#52b788'
      }
    },
  },
  plugins: [],
}
