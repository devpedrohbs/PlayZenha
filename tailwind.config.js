/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0F0F23',
        'dark-blue': '#1E1B4B',
        'playzenha-blue': '#3B82F6',
        'playzenha-yellow': '#FDE047',
        'success-green': '#10B981',
        'danger-red': '#EF4444',
      },
      fontFamily: {
        'fredoka': ['Fredoka One', 'cursive'],
        'comfortaa': ['Comfortaa', 'sans-serif'],
      },
    },
  },
  plugins: [],
}