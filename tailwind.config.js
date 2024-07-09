/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary-default))',
          medium: 'hsl(var(--color-primary-medium))',
          400: 'hsl(var(--color-primary-400))',
          150: 'hsl(var(--color-primary-150))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary-default))',
          700: 'hsl(var(--color-secondary-700))',
          soft: 'hsl(var(--color-secondary-600))',
        },
        background: {
          DEFAULT: 'hsl(var(--color-background))',
        },
        border: {
          DEFAULT: 'hsl(var(--color-border))',
          primary: 'hsl(var(--color-border-primary))',
        },
        danger: {
          DEFAULT: 'hsl(var(--color-danger-500))',
          300: 'hsl(var(--color-danger-300))',
          500: 'hsl(var(--color-danger-500))',
        },
        grey: {
          0: 'hsl(var(--color-grey-0))',
          50: 'hsl(var(--color-grey-50))',
          100: 'hsl(var(--color-grey-100))',
          150: 'hsl(var(--color-grey-150))',
          400: 'hsl(var(--color-grey-400))',
          600: 'hsl(var(--color-grey-600))',
          800: 'hsl(var(--color-grey-800))',
          900: 'hsl(var(--color-grey-900))',

          disabled: 'hsl(var(--color-grey-disabled))',
        },
        success: {
          DEFAULT: 'hsl(var(--color-success))',
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
        poppins: ['var(--font-poppins)', defaultTheme.fontFamily],
        'source-sans-pro': ['var(--font-source-sans-pro)', defaultTheme.fontFamily],
        roboto: ['var(--font-roboto)', defaultTheme.fontFamily],
        'open-sans': ['var(--font-open-sans)', defaultTheme.fontFamily],

        default: ['var(--font-family)', defaultTheme.fontFamily],
      },
      backgroundImage: {
        'auth-background': 'var(--bg-img-src)',
        'prompt-background1': "url('/images/prompts/image-01.png')",
        'prompt-background2': "url('/images/prompts/image-02.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        'chat-screen-height': 'calc(100vh - 72px)',
        'capture-button': '104px',
        84: '84px',
        21: '5.25rem',        
        '34-px': '34px',
        '9.5': '2.375rem',
        'profile-drawer': '168px',
        '68-px': '68px',
        '45-px': '45px',
      },
      width: {
        'capture-button': '104px',
        84: '84px',
        'profile-drawer': '216px',
      },
      borderRadius: {
        '3xs': 'calc(var(--radius) / 6)',
        '2xs': 'calc(var(--radius) / 3)',
        xs: 'calc(var(--radius) / 2)',
        sm: 'calc(var(--radius) / 1.2)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) * 1.334)',
        xl: 'calc(var(--radius) * 1.666)',
        '2xl': 'calc(var(--radius) * 2)',
        '3xl': 'calc(var(--radius) * 2.666)',
        '4xl': 'calc(var(--radius) * 3.333)',
        '5xl': 'calc(var(--radius) * 4)',
      },
      boxShadow: {
        'agent-sidebar': 'box-shadow: 0px 3px 12px 0px hsl(var(--color-background)/ 0.06)',
        'switch-active': 'box-shadow: 0px 0.833px 6.66px 0px hsl(var(--color-content-accent-hover)/ 0.5) inset',
        'switch-deactive': '0px 1px 8px 0px hsl(var(--color-content-accent)/ 0.45) inset',
        'switch-disable': '0px 1px 8px 0px rgba(0, 0, 0, 0.15) inset',
        'switch-circle-active': '0px 0px 1.17px 0px hsl(var(--color-danger)/ 0.2)',
        'switch-circle-deactive': '0px 0px 2px 0px hsl(var(--color-danger)/ 0.1)',
      },
      maxWidth: {
        'modal-xxl': '1050px',
      },
      spacing: {
        '1px': '1px',
        '58': '14rem',
        22: '5.5rem',
      },
      strokeWidth: {
        4: '4px',
      },
      animation: {
        floatA: 'floatA 5s linear infinite',
        floatB: 'floatB 5s linear infinite',
        'ring-3s': 'ring 3s linear infinite',
        'ring-5s': 'ring 5s linear infinite',
        'fade-in': 'fade-in 350ms linear',
        'fade-out': 'fade-out 350ms linear',
      },
      keyframes: {
        floatA: {
          '0%, 100%': {transform: 'translateX(0) translateY(8px) opacity(100)'},
          '12.5%': {transform: 'translateX(-4px) translateY(4px)'},
          '25%': {transform: 'translateX(-8px) translateY(0)'},
          '37.5%': {transform: 'translateX(-4px) translateY(-4px)'},
          '50%': {transform: 'translateX(0) translateY(-8px) opacity(50%)'},
          '62.5%': {transform: 'translateX(4px) translateY(-4px)'},
          '75%': {transform: 'translateX(8px) translateY(0)'},
          '87.5%': {transform: 'translateX(4px) translateY(4px)'},
        },
        floatB: {
          '0%, 100%': {transform: 'translateX(-4px) translateY(4px)'},
          '12.5%': {transform: 'translateX(-8px) translateY(0)'},
          '25%': {transform: 'translateX(-4px) translateY(-4px)'},
          '37.5%': {transform: 'translateX(0) translateY(-8px)'},
          '50%': {transform: 'translateX(4px) translateY(-4px)'},
          '62.5%': {transform: 'translateX(8px) translateY(0)'},
          '75%': {transform: 'translateX(4px) translateY(4px)'},
          '87.5%': {transform: 'translateX(0) translateY(8px)'},
        },
        ring: {
          '0%, 100%': {boxShadow: 'var(--tw-ring-color) 0 0 0 7px'},
          '50%': {boxShadow: 'var(--tw-ring-color) 0 0 0 1px'},
        },
        'fade-in': {
          '0%': {transform: 'translateY(100px)', opacity: 0},
          '100%': {transform: 'translateY(0)', opacity: 1},
        },
        'fade-out': {
          '0%': {transform: 'translateY(0)', opacity: 1},
          '100%': {transform: 'translateY(100px)', opacity: 0},
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
