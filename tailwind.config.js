/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-base) / 0.05)',
          100: 'rgb(var(--color-primary-base) / 0.1)',
          200: 'rgb(var(--color-primary-base) / 0.2)',
          300: 'rgb(var(--color-primary-base) / 0.3)',
          400: 'rgb(var(--color-primary-base) / 0.4)',
          500: 'rgb(var(--color-primary-base) / 1)',
          600: 'rgb(var(--color-primary-base) / 0.9)',
          700: 'rgb(var(--color-primary-base) / 0.8)',
          800: 'rgb(var(--color-primary-base) / 0.7)',
          900: 'rgb(var(--color-primary-base) / 0.6)',
        }
      }
    },
  },
  plugins: [],
};