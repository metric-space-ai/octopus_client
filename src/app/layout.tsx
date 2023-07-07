import './globals.css';

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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <head>
        <meta name='config' content={JSON.stringify(getClientConfig())} />
      </head>
      <body>{children}</body>
    </html>
  );
}
