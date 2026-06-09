/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#4f46e5',
        'primary-hover': '#4338ca',
        'gov-blue': '#0b3a6e',
        'sidebar-active': '#147bd1',
        'text-muted': '#64748b',
        'text-dark': '#0f172a',
        'border-light': '#e2e8f0',
      },
    },
  },
  plugins: [],
}

