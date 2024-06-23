'use client';
import {useEffect} from 'react';
import classNames from 'classnames';
import {useThemeStore} from '@/store/themeData';
import {useAuthContext} from '@/contexts/authContext';
import {IThemeData} from '@/types';

export default function ThemeProvider({children}: {children: React.ReactNode}) {
  const {themeData, handleSetColorVariable, setThemeData} = useThemeStore();
  const {currentUserCompany, companyIsLoading} = useAuthContext();

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

        handleSetColorVariable(companyStyleparsedData.cssVariables);
        setThemeData(companyStyleparsedData);
      } else {
        handleSetColorVariable(themeData.cssVariables);
      }
    }
  }, [companyIsLoading]);

  return (
    <body className={classNames('bg-grey-900', `font-${themeData.font}`)} suppressHydrationWarning={true}>
      {children}
    </body>
  );
}
