/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      'night-blue': 'var(--color-night-blue)',
      'pale-blue': 'var(--color-pale-blue)',
      'white': 'var(--color-white)',
    },
    fontFamily: {
      'dubai': ['Dubai', 'sans-serif'],
      'roystorie': ['Roystorie', 'serif'],
    },
    spacing: {
      300: '30rem',
      150: '15rem',
      50: '5rem',
      35: '3.5rem',
      25: '2.5rem',
      0: 0,
      container: '5rem'
    },
    fontSize: {
      150: '15rem',
      22: '2.2rem',
      18: '1.8rem',
      15: '1.5rem',
    },
    lineHeight: {
      '1.6' : '160%'
    },
    borderRadius: {
      10: '1rem',
    },
    borderWidth: {
      px: '1px',
    },
    transitionTimingFunction: {
      'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
    },  
    extend: {
      width: {
        440: '44rem',
        screen: '100vw',
      }, 
      height: {
        screen: '100vh',
      },
    },
  },
  plugins: [],
}

