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
          primary: '#FFFFFF',
          secondary: '#F6F6F6',
          tertiary: '#F6F6F6',
          dark: '#2C2C2C',
          darkgreen: '#1E2F08',
          black: '#000000',
          modal: 'rgba(212, 213, 210, 0.10)',
        },
        border: {
          default: '#DFDFDF',
          primary: '#1B74E4',
        },
        content: {
          white: '#FFFFFF',
          primary: '#1F1F1F',
          secondary: '#555555',
          tertiary: '#DFDFDF',
          disabled: '#B3B3B3',
          accent: '#0058E2',
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
        38: '38px',
        40: '40px',
        48: '48px',
      },
      fontFamily: {
        'neue-haas': ['Neue Haas Grotesk Display Pro', defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
