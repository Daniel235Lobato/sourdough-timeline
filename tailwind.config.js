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
        // The Cohesive Elegant Sourdough Palette
        cream: '#FAF5EE',
        linen: '#E7CEB5',
        oat: '#D1C1A8',
        flax: '#AD9677',
        walnut: '#2E1E14',
        crust: '#986A4C',

        // Cohesive mapping for all framework color references
        stone: {
          50: '#FAF5EE',
          100: '#FAF5EE',
          200: '#E7CEB5',
          300: '#D1C1A8',
          400: '#AD9677',
          500: '#AD9677',
          600: '#986A4C',
          700: '#2E1E14',
          800: '#2E1E14',
          900: '#2E1E14',
          950: '#2E1E14',
        },
        flour: {
          50: '#FAF5EE',
          100: '#FAF5EE',
          200: '#E7CEB5',
          300: '#D1C1A8',
          400: '#AD9677',
          500: '#AD9677',
          600: '#986A4C',
          700: '#2E1E14',
          800: '#2E1E14',
          900: '#2E1E14',
          950: '#2E1E14',
        },
        amber: {
          50: '#FAF5EE',
          100: '#FAF5EE',
          200: '#E7CEB5',
          300: '#D1C1A8',
          400: '#AD9677',
          500: '#986A4C',
          600: '#986A4C',
          700: '#2E1E14',
          800: '#2E1E14',
          900: '#2E1E14',
          950: '#2E1E14',
        },
        orange: {
          50: '#FAF5EE',
          100: '#FAF5EE',
          200: '#E7CEB5',
          300: '#D1C1A8',
          400: '#AD9677',
          500: '#986A4C',
          600: '#986A4C',
          700: '#2E1E14',
          800: '#2E1E14',
          900: '#2E1E14',
          950: '#2E1E14',
        },
        emerald: {
          50: '#FAF5EE',
          100: '#FAF5EE',
          200: '#E7CEB5',
          300: '#D1C1A8',
          400: '#AD9677',
          500: '#2E1E14',
          600: '#2E1E14',
          700: '#2E1E14',
          800: '#2E1E14',
          900: '#2E1E14',
          950: '#2E1E14',
        },
        sky: {
          50: '#FAF5EE',
          100: '#FAF5EE',
          200: '#E7CEB5',
          300: '#D1C1A8',
          400: '#AD9677',
          500: '#2E1E14',
          600: '#2E1E14',
          700: '#2E1E14',
          800: '#2E1E14',
          900: '#2E1E14',
          950: '#2E1E14',
        },
        starter: {
          light: '#FAF5EE',
          DEFAULT: '#986A4C',
          dark: '#2E1E14'
        },
        retard: {
          light: '#FAF5EE',
          DEFAULT: '#AD9677',
          dark: '#2E1E14'
        },
        bake: {
          light: '#FAF5EE',
          DEFAULT: '#986A4C',
          dark: '#2E1E14'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(46, 30, 20, 0.08), 0 1px 3px -1px rgba(46, 30, 20, 0.05)',
        'card-hover': '0 12px 24px -6px rgba(46, 30, 20, 0.12), 0 4px 8px -2px rgba(46, 30, 20, 0.06)',
        'dock': '0 -4px 20px -2px rgba(46, 30, 20, 0.08), 0 -2px 6px -1px rgba(46, 30, 20, 0.04)',
        'glow-amber': '0 0 20px -4px rgba(152, 106, 76, 0.25)',
        'glow-emerald': '0 0 20px -4px rgba(46, 30, 20, 0.25)',
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
