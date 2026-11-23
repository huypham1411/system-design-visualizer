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
        dark: {
          bg: '#0a0d14',
          card: '#121722',
          border: '#1f293d',
          sidebar: '#0d111a',
          hover: '#1b2334'
        },
        light: {
          bg: '#faf8f5',
          card: '#ffffff',
          border: '#e5e0d8',
          sidebar: '#f3efe8',
          hover: '#ebe5dc'
        },
        brand: {
          amber: '#f59e0b',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          violet: '#8b5cf6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
