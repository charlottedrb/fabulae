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

