import {create} from 'zustand';
import {APPTHEMENAME} from '@/constant';
import {IThemeData, TThemeName} from '@/types';

const ALLTHEMES: Record<TThemeName, IThemeData> = {
  default: {
    content: {
      title: 'Octopus',
    },
    font: 'poppins',
    cssVariables: {
      '--color-primary-default': '274 82% 44%',
      '--color-primary-medium': '273 100% 35%',
      '--color-primary-400': '274 83% 67%',
      '--color-primary-150': '274 71% 87%',

      '--color-secondary-default': '83 100% 33%',
      '--color-secondary-600': '216 86% 65%',
      '--color-secondary-700': '216 100% 35%',

      '--color-background': '0 0% 12%',

      '--color-border': '0 0% 96%',
      '--color-border-primary': '213 79% 50%',

      '--color-danger-300': '2, 76%, 66%',
      '--color-danger-500': '2, 70%, 53%',

      '--color-success': '83 100% 33%',
      '--color-success-soft': '149 81% 94%',

      '--color-grey-0': '0 0% 100%',
      '--color-grey-50': '0 0% 96%',
      '--color-grey-100': '0 0% 96%',
      '--color-grey-150': '0 0% 88%',
      '--color-grey-400': '0, 0%, 60%',
      '--color-grey-600': '0 0% 36%',
      '--color-grey-800': '0 0% 17%',
      '--color-grey-900': '0 0% 12%',

      '--color-grey-disabled': '0 0% 68%',

      '--radius': '0.75rem',

      '--bg-img-src': "url('/images/theme/bg-default.jpg')",
      mode: 'light',
    },
  },
  'default-dark': {
    mode: 'light',
    content: {
      title: 'Octopus',
    },
    font: 'poppins',
    cssVariables: {
      '--color-primary-default': '274 82% 44%',
      '--color-primary-medium': '273 100% 35%',
      '--color-primary-400': '274 83% 67%',
      '--color-primary-150': '274 71% 87%',

      '--color-secondary-default': '83 100% 33%',
      '--color-secondary-600': '216 86% 65%',
      '--color-secondary-700': '216 100% 35%',

      '--color-background': '0 0% 12%',

      '--color-border': '0 0% 96%',
      '--color-border-primary': '213 79% 50%',

      '--color-danger-300': '2, 76%, 66%',
      '--color-danger-500': '2, 70%, 53%',

      '--color-success': '83 100% 33%',
      '--color-success-soft': '149 81% 94%',

      '--color-grey-0': '0 0% 100%',
      '--color-grey-50': '0 0% 96%',
      '--color-grey-100': '0 0% 96%',
      '--color-grey-150': '0 0% 88%',
      '--color-grey-400': '0, 0%, 60%',
      '--color-grey-600': '0 0% 36%',
      '--color-grey-800': '0 0% 17%',
      '--color-grey-900': '0 0% 12%',

      '--color-grey-disabled': '0 0% 68%',

      '--radius': '0.75rem',

      '--bg-img-src': "url('/images/theme/bg-default.jpg')",
    },
  },
  rotodecor: {
    font: 'roboto',
    content: {
      title: 'Rotodecor',
      head_logo: {
        url: 'https://rotodecor.com/wp-content/uploads/2020/07/Logo_rotodecor_rot.svg',
        width: 130,
        height: 32,
        alt: 'head-logo-rotodecor',
      },
      chat_logo: {
        url: 'https://rotodecor.com/wp-content/uploads/2020/11/cropped-favicon-32x32.jpg',
        width: 25,
        height: 25,
        alt: 'rotodecor-logo',
      },
    },
    cssVariables: {
      '--color-primary-default': '340 100% 35%',
      '--color-primary-medium': '347 66% 47%',
      '--color-primary-400': '347 66% 47%',
      '--color-primary-150': '340 45% 82%',

      '--color-secondary-default': '343 88% 16%',
      '--color-secondary-600': '196 59% 60%',
      '--color-secondary-700': '193 100% 35%',

      '--color-background': '214 25% 94%',

      '--color-border': '210 40% 98%',
      '--color-border-primary': '340 45% 82%',

      '--color-danger-300': '0 100% 40%',
      '--color-danger-500': '0 100% 40%',

      '--color-success': '104 100% 35%',
      '--color-success-soft': '104 100% 35%',

      '--color-grey-0': '0 0% 100%',
      '--color-grey-50': '210 40% 98%',
      '--color-grey-100': '214 25% 94%',
      '--color-grey-150': '213 27% 84%',
      '--color-grey-400': '215 16% 47%',
      '--color-grey-600': '215 25% 27%',
      '--color-grey-800': '215 25% 27%',
      '--color-grey-900': '229 84% 5%',

      '--color-grey-disabled': '0 0% 68%',

      '--radius': '0.05rem',

      '--bg-img-src': "url('/images/theme/bg-rotodecor.jpg')",
    },
  },
  topwerk: {
    font: 'roboto',
    content: {
      title: 'Topwerk',
      head_logo: {
        url: 'https://www.topwerk.com/fileadmin/user_upload/topwerk_main_logo.png',
        width: 130,
        height: 32,
        alt: 'head-logo-topwerk',
      },
      chat_logo: {
        url: 'https://www.topwerk.com/fileadmin/user_upload/favicon-topwerk.png',
        width: 24,
        height: 24,
        alt: 'topwerk-logo',
      },
    },
    cssVariables: {
      '--color-primary-default': '3 56% 36%',
      '--color-primary-medium': '5 46% 46%',
      '--color-primary-400': '5 46% 46%',
      '--color-primary-150': '3 32% 68%',

      '--color-secondary-default': '145 56% 36%',
      '--color-secondary-600': '212 53% 68%',
      '--color-secondary-700': '210 56% 36%',

      '--color-background': '0 0% 91%',

      '--color-border': '0 0% 97%',
      '--color-border-primary': '3 32% 68%',

      '--color-danger-300': '0 74% 42%',
      '--color-danger-500': '0 74% 42%',

      '--color-success': '101 56% 36%',
      '--color-success-soft': '101 56% 36%',

      '--color-grey-0': '0 0% 100%',
      '--color-grey-50': '0 0% 97%',
      '--color-grey-100': '0 0% 91%',
      '--color-grey-150': '0 0% 86%',
      '--color-grey-400': '0 0% 60%',
      '--color-grey-600': '0 0% 32%',
      '--color-grey-800': '0 0% 32%',
      '--color-grey-900': '0 0% 11%',

      '--color-grey-disabled': '0 0% 68%',

      '--radius': '0.15rem',

      '--bg-img-src': "url('/images/theme/bg-topwerk.jpg')",
    },
  },
  harting: {
    font: 'roboto',
    content: {
      title: 'Harting',
      head_logo: {
        url: 'https://static.harting.com/assets/logo.png',
        width: 145,
        height: 40,
        alt: 'bg-harting',
      },
      chat_logo: {
        url: 'https://static.harting.com/assets/logo.png',
        width: 145,
        height: 40,
        alt: 'harting-logo',
      },
    },
    cssVariables: {
      '--color-primary-default': `45 90% 62%`,
      '--color-primary-medium': `47 71% 69%`,
      '--color-primary-400': `47 71% 69%`,
      '--color-primary-150': `45 100% 87%`,

      '--color-secondary-default': `250 90% 62%`,
      '--color-secondary-600': `226 66% 74%`,
      '--color-secondary-700': `229 59% 57%`,

      '--color-background': `48 24% 96%`,

      '--color-border': `0 0% 100%`,
      '--color-border-primary': `45 100% 87%`,

      '--color-danger-300': `0 100% 61%`,
      '--color-danger-500': `0 100% 61%`,

      '--color-success': `119 70% 46%`,
      '--color-success-soft': `119 70% 46%`,

      '--color-grey-0': `0 0% 100%`,
      '--color-grey-50': `0 0% 98%`,
      '--color-grey-100': `48 24% 96%`,
      '--color-grey-150': `51 7% 80%`,
      '--color-grey-400': `51 3% 50%`,
      '--color-grey-600': `51 4% 38%`,
      '--color-grey-800': `51 4% 38%`,
      '--color-grey-900': `48 8% 12%`,

      '--color-grey-disabled': `0 0% 68%`,

      '--radius': `0.05rem`,

      '--bg-img-src': `url('/images/theme/bg-harting.jpg')`,
    },
  },
  statista: {
    font: 'roboto',
    content: {
      title: 'Statista',
      head_logo: {
        url: 'https://cdn.statcdn.com/static/img/Statista-Logo-Color-Primary.png',
        width: 112,
        height: 24,
        alt: 'head-logo-Statista',
      },
      chat_logo: {
        url: 'https://www.statista.com/favicon-48x48.png',
        width: 25,
        height: 25,
        alt: 'statista-logo',
      },
    },
    cssVariables: {
      '--color-primary-default': '215 94% 46%',
      '--color-primary-medium': '215 98% 56%',
      '--color-primary-400': '215 98% 56%',
      '--color-primary-150': '215 100% 84%',

      '--color-secondary-default': '101 100% 31%',
      '--color-secondary-600': '272 75% 61%',
      '--color-secondary-700': '272 72% 47%',

      '--color-background': '0 0% 100%',

      '--color-border': '215 2% 99%',
      '--color-border-primary': '213 79% 50%',

      '--color-danger-300': '2 80% 44%',
      '--color-danger-500': '2 80% 44%',

      '--color-success': '83 100% 33%',
      '--color-success-soft': '83 100% 33%',

      '--color-grey-0': '0 0% 100%',
      '--color-grey-50': '215 2% 99%',
      '--color-grey-100': '210 100% 97%',
      '--color-grey-150': '210 5% 92%',
      '--color-grey-400': '210 10% 59%',
      '--color-grey-600': '205 6% 29%',
      '--color-grey-800': '205 6% 29%',
      '--color-grey-900': '0 0% 12%',

      '--color-grey-disabled': '0 0% 68%',

      '--radius': '0.25rem',

      '--bg-img-src': "url('/images/theme/bg-statista.jpg')",
    },
  },
};

const initialsThemeData: IThemeData = ALLTHEMES[APPTHEMENAME];

interface IThemeStoreProps {
  themeData: IThemeData;
  setThemeData: (value: IThemeData) => void;
  handleSetColorVariable: (obj: Record<string, string>) => void;
  allThemes: Record<TThemeName, IThemeData>;
}

export const useThemeStore = create<IThemeStoreProps>()((set, get) => ({
  themeData: initialsThemeData,
  allThemes: ALLTHEMES,
  setThemeData(themeData) {
    set({themeData});
  },
  handleSetColorVariable(obj) {
    for (const key in obj) {
      document.documentElement.style.setProperty(key, obj[key]);
    }
  },
}));
