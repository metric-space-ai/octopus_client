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
          'grey-50': 'var(--Grey-600, #5C5C5C)',
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
          disabled: '#AEAEAE',
          green: '#67A800',
          'red-600': '#DB3A34',
          'red-400': '#EA6C68',
        },
        success: {
          default: '#00875A',
          soft: '#E3FCEF',
        },
      },
      fontSize: {
        xxs: '0.625rem',
        xxl: '1.375rem',
        between_sm_base: '0.9375rem',
        '5.5xl': '2.75rem',
        32: '2rem',
        38: '2.375rem',
        40: '2.5rem',
        44: '2.75rem',
        48: '3rem',
      },
      fontFamily: {
        // poppins: ['var(--font-poppins)', defaultTheme.fontFamily],
        'poppins-bold': ['poppins-bold'],
        'poppins-light': ['poppins-light'],
        'poppins-medium': ['poppins-medium'],
        'poppins-regular': ['poppins-regular'],
        'poppins-semibold': ['poppins-semibold'],
      },
      backgroundImage: {
        'auth-background': "url('/images/auth-background.jpg')",
        'prompt-background1': "url('/images/prompts/image-01.png')",
        'prompt-background2': "url('/images/prompts/image-02.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        'chat-screen-height': 'calc(100vh - 72px)',
        'capture-button': '104px',
        84: '84px',
        'profile-drawer': '168px',
      },
      width: {
        'capture-button': '104px',
        84: '84px',
        'profile-drawer': '216px',
      },
      borderRadius: {
        20: '20px',
      },
    },
  },
  plugins: [],
};
