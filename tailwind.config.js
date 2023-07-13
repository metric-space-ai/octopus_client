/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#A4F83A',
          soft: '#FFFFFF',
        },
        secondary: {
          default: '#E4FFBF',
          soft: '#FCF7E8',
        },
        background: {
          dark: '#1F1F1F',
          graydark: '#989898',
          darkgreen: '#1E2F08',
          modal: 'rgba(212, 213, 210, 0.10)',
        },
        border: {
          default: '#DFDFDF',
          primary: '#1B74E4',
        },
        content: {
          white: '#FFFFFF',
          'grey-100': '#F5F5F5',
          'grey-400': '#989898',
          'grey-600': '#5C5C5C',
          'grey-900': '#2C2C2C',
          black: '#1F1F1F',
          accent: '#7B14CB',
          'accent-hover': '#6500B5',
          'accent-100': '#E0C5F5',
          'accent-400': '#B466F1',
          'blue-dark': '#0048B5',
          'blue-light': '#5896F2',
          green: '#67A800',
          red: '#DB3A34',
        },
        success: {
          default: '#00875A',
          soft: '#E3FCEF',
        },
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        32: '32px',
        38: '38px',
        40: '40px',
        44: '44px',
        48: '48px',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'auth-background': "url('/images/auth-background.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
