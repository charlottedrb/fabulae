/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      'night-blue': 'var(--color-night-blue)',
      'white': 'var(--color-white)',
    },
    fontFamily: {
      'dubai': ['Dubai', 'sans-serif'],
      'roystorie': ['Roystorie', 'serif'],
    },
    padding: {
      0: 0,
      container: '5rem'
    },
    spacing: {
      50: '5rem',
      0: 0,
    },
    padding: {
      300: '30rem',
      150: '15rem',
      0: 0,

    },
    fontSize: {
      200: '200px'
    },
    extend: {
      width: {
        screen: '100vw',
      }, 
      height: {
        screen: '100vh',
      },
    },
  },
  plugins: [],
}

