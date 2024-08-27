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
