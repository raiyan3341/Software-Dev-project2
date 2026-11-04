/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488', // MediStock primary teal/emerald
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          dark: '#0f172a',
          navy: '#0b1d3a',
          surface: '#f8fafc',
          card: '#ffffff',
          cyan: '#06b6d4',
          cyanBg: '#e0f7fa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

