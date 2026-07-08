/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#06132D',
        'dark-blue': '#0D1B3D',
        'playzenha-blue': '#0441F2',
        'playzenha-yellow': '#FFC603',
        'playzenha-surface': '#0D1B3D',
        'playzenha-card': '#142857',
        'playzenha-hover': '#1D3670',
        'playzenha-muted': '#94A3B8',
        'success-green': '#10B981',
        'danger-red': '#EF4444',
      },
      fontFamily: {
        'fredoka': ['Fredoka', 'Inter', 'system-ui', 'sans-serif'],
        'comfortaa': ['Inter', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'geist-pixel': ['Geist Pixel', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
