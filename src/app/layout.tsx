import {StrictMode} from 'react';

import classNames from 'classnames';
import {Open_Sans, Poppins, Roboto, Source_Sans_3} from 'next/font/google';
import {Toaster} from 'react-hot-toast';

import {RedirectPathProvider} from '@/components/redirect-path';
import {APPTHEMENAME} from '@/constant';
import AuthProvider from '@/contexts/authContext';

import StoreProvider from './StoreProvider';
import ThemeProvider from './ThemeProvider';

import './globals.css';
export const metadata = {
  title: 'Octopus',
  description: 'Your personal ChatGPT Chat Bot.',
  icons: {
    iconDark: '/logo-dark.png',
    iconLight: '/logo-light.png',
    shortcut: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#fafafa'},
    {media: '(prefers-color-scheme: dark)', color: '#151515'},
  ],
  appleWebApp: {
    title: 'Octopus Web',
    statusBarStyle: 'default',
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const sourceSansPro = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans-pro',
});
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});
export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      suppressHydrationWarning
      lang='en'
      className={classNames(
        poppins.variable,
        sourceSansPro.variable,
        roboto.variable,
        openSans.variable,
        APPTHEMENAME.includes('default-dark') && 'dark',
      )}
      style={{fontSize: 16}}
    >
      <body>
        <StrictMode>
          <StoreProvider>
            <AuthProvider>
              <ThemeProvider>
                <RedirectPathProvider>{children}</RedirectPathProvider>
                <Toaster position='top-right' />
              </ThemeProvider>
            </AuthProvider>
          </StoreProvider>
        </StrictMode>
      </body>
    </html>
  );
}
