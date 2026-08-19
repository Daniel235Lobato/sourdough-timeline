/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crust: {
          50: '#fdf8f4',
          100: '#f9eee5',
          200: '#f3d9c7',
          300: '#e9bca0',
          400: '#dc9773',
          500: '#ce7449',
          600: '#be5d3c',
          700: '#9e4932',
          800: '#7f3c2c',
          900: '#673327',
          950: '#381812',
        },
        flour: {
          50: '#fbfaf8',
          100: '#f6f3ee',
          200: '#ede6dc',
          300: '#dfd4c5',
          400: '#ccbba8',
          500: '#b8a08c',
          600: '#a38774',
          700: '#866d5e',
          800: '#6d584d',
          900: '#594941',
          950: '#2f2520',
        },
        starter: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857'
        },
        retard: {
          light: '#f0f9ff',
          DEFAULT: '#0284c7',
          dark: '#0369a1'
        },
        bake: {
          light: '#fff7ed',
          DEFAULT: '#ea580c',
          dark: '#c2410c'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'bubble': 'bubble 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.4' },
          '50%': { transform: 'translateY(-15px) scale(1.1)', opacity: '0.9' },
          '100%': { transform: 'translateY(-30px) scale(0.6)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
