/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      'night-blue': 'rgba(var(--color-night-blue) / <alpha-value>)',
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
      100: '10rem',
      70: '7rem',
      60: '6rem',
      50: '5rem',
      40: '4rem',
      35: '3.5rem',
      30: '3rem',
      25: '2.5rem',
      15: '1.5rem',
      10: '1rem',
      0: 0,
      container: '5rem'
    },
    fontSize: {
      150: '15rem',
      100: '10rem',
      80: '8rem',
      60: '6rem',
      45: '4.5rem',
      30: '3rem',
      22: '2.2rem',
      18: '1.8rem',
      15: '1.5rem',
    },
    lineHeight: {
      '1.6' : '160%',
      1: '100%',
    },
    borderRadius: {
      10: '1rem',
      full: '9999px',
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
        240: '24rem',
        200: '20rem',
        36: '3.6rem',
        screen: '100vw',
      }, 
      height: {
        screen: '100vh',
      },
    },
  },
  plugins: [],
}

