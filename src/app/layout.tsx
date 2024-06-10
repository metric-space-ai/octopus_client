'use client';
import './globals.css';
import {StrictMode, useEffect, useState} from 'react';
import {Open_Sans, Poppins, Roboto, Source_Sans_3} from 'next/font/google';
import {Toaster} from 'react-hot-toast';
import {RedirectPathProvider} from '@/components/redirect-path';
import AuthProvider from '@/contexts/authContext';
import StoreProvider from './StoreProvider';
import classNames from 'classnames';
import {metadata} from './metadata';
import {useThemeStore} from '@/store/themeData';

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
  const {themeData, handleSetColorVariable} = useThemeStore();
  const possible = ['font-poppins', 'font-source-sans-pro', 'font-roboto', 'font-open-sans'];
  useEffect(() => {
    handleSetColorVariable(themeData.cssVariables);
  }, []);

  return (
    <StrictMode>
      <html
        lang='en'
        className={classNames(poppins.variable, sourceSansPro.variable, roboto.variable, openSans.variable)}
        style={{fontSize: 16}}
      >
        <body className={classNames('bg-grey-900', `font-${themeData.font}`)} suppressHydrationWarning={true}>
          <StoreProvider>
            <AuthProvider>
              <RedirectPathProvider>{children}</RedirectPathProvider>
              <Toaster position='top-right' />
            </AuthProvider>
          </StoreProvider>
        </body>
      </html>
    </StrictMode>
  );
}

// "use client"
// import './globals.css';

// import {Open_Sans, Poppins, Roboto, Source_Sans_3} from 'next/font/google';
// import {Toaster} from 'react-hot-toast';

// import {RedirectPathProvider} from '@/components/redirect-path';
// import AuthProvider from '@/contexts/authContext';
// import StoreProvider from './StoreProvider';
// import {StrictMode, useEffect, useState} from 'react';
// import classNames from 'classnames';

// export const metadata = {
//   title: 'Octopus',
//   description: 'Your personal ChatGPT Chat Bot.',
//   icons: {
//     iconDark: '/logo-dark.png',
//     iconLight: '/logo-light.png',
//     shortcut: '/apple-touch-icon.png',
//     apple: '/apple-touch-icon.png',
//   },
//   viewport: {
//     width: 'device-width',
//     initialScale: 1,
//     maximumScale: 1,
//   },
//   themeColor: [
//     {media: '(prefers-color-scheme: light)', color: '#fafafa'},
//     {media: '(prefers-color-scheme: dark)', color: '#151515'},
//   ],
//   appleWebApp: {
//     title: 'Octopus Web',
//     statusBarStyle: 'default',
//   },
// };

// const poppins = Poppins({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['300', '400', '500', '600', '700'],
//   variable: '--font-poppins',
// });

// const sourceSansPro = Source_Sans_3({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-source-sans',
// });
// const roboto = Roboto({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['300', '400', '500', '700'],
//   variable: '--font-roboto',
// });
// const openSans = Open_Sans({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '600', '700'],
//   variable: '--font-open-sans',
// });

// export default function RootLayout({children}: {children: React.ReactNode}) {
//   const [fontFamily, setFontFamily] = useState('');

//   useEffect(() => {
//     setFontFamily(localStorage?.getItem('octopus-theme-font') ?? 'font-poppins');
//   }, []);

//   const possible = ['font-poppins', 'font-roboto', 'font-sourceSansPro', 'font-openSans'];
//   return (
//     <StrictMode>
//       <html
//         lang='en'
//         className={classNames(poppins.variable, sourceSansPro.variable, roboto.variable, openSans.variable, fontFamily)}
//         style={{fontSize: 16}}
//       >
//         <body className='bg-grey-900' suppressHydrationWarning={true}>
//           <StoreProvider>
//             <AuthProvider>
//               <RedirectPathProvider>{children}</RedirectPathProvider>
//               <Toaster position='top-right' />
//             </AuthProvider>
//           </StoreProvider>
//         </body>
//       </html>
//     </StrictMode>
//   );
// }
