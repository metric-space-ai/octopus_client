'use client';

import {redirect, usePathname} from 'next/navigation';

import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';

const protectedPaths = [paths.chat, paths.setting];

export const RedirectPath = ({children}: {children: React.ReactNode}): React.ReactNode => {
  const pathname = usePathname();
  const {isAuthenticated} = useAuthContext();

  if (!protectedPaths.includes(pathname) && isAuthenticated) {
    redirect(paths.chat);
    return null;
  }

  if (!pathname.includes('auth') && !isAuthenticated) {
    redirect('/auth/login');
  }

  return children;
};
