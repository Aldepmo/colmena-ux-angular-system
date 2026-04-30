/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        colmena: {
          primary: '#D4AF37',
          'primary-content': '#1A2E35',
          secondary: '#1A2E35',
          'secondary-content': '#F9F7F2',
          accent: '#FFD700',
          'accent-content': '#1A2E35',
          neutral: '#4A4A4A',
          'neutral-content': '#F9F7F2',
          'base-100': '#F9F7F2',
          'base-200': '#EFEBE0',
          'base-300': '#E2DDCF',
          'base-content': '#1A2E35',
          info: '#3B82F6',
          success: '#15803D',
          warning: '#CA8A04',
          error: '#B91C1C',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
