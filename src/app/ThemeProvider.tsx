/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import {useEffect} from 'react';

import classNames from 'classnames';

import {useAuthContext} from '@/contexts/authContext';
import {useThemeStore} from '@/store/themeData';
import {IThemeData} from '@/types';

export default function ThemeProvider({children}: {children: React.ReactNode}) {
  const {themeData, handleSetColorVariable, setThemeData} = useThemeStore();
  const {currentUserCompany, companyIsLoading} = useAuthContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const possible = ['font-poppins', 'font-source-sans-pro', 'font-roboto', 'font-open-sans'];

  const checkCustomStylesIsValid = (customeStyles: string) => {
    if (customeStyles) {
      const companyStyleparsedData: IThemeData = JSON.parse(customeStyles);
      if (companyStyleparsedData && companyStyleparsedData.cssVariables) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    if (!companyIsLoading) {
      if (
        currentUserCompany &&
        currentUserCompany.custom_style &&
        checkCustomStylesIsValid(currentUserCompany.custom_style)
      ) {
        const companyStyleparsedData: IThemeData = JSON.parse(currentUserCompany.custom_style);
        if (companyStyleparsedData.mode === 'dark') {
          if (!document.documentElement.classList.contains('dark')) document.documentElement.classList.add('dark');
        } else {
          if (document.documentElement.classList.contains('dark')) document.documentElement.classList.remove('dark');
        }
        handleSetColorVariable(companyStyleparsedData.cssVariables);
        setThemeData(companyStyleparsedData);
      } else if (themeData) {
        handleSetColorVariable(themeData.cssVariables);
      }
    }
  }, [companyIsLoading]);

  return (
    <body className={classNames('bg-grey-900', `font-${themeData?.font ?? 'roboto'}`)} suppressHydrationWarning={true}>
      {children}
    </body>
  );
}
