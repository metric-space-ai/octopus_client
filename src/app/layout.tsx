import './globals.css';

import {Poppins} from 'next/font/google';

import {getClientConfig} from '../config/client';

export const metadata = {
  title: 'Octopus',
  description: 'Your personal ChatGPT Chat Bot.',
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
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en' className={`${poppins.variable}`}>
      <head>
        <meta name='config' content={JSON.stringify(getClientConfig())} />
      </head>
      <body className='font-poppins'>{children}</body>
    </html>
  );
}
