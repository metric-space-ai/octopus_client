'use client';

import {usePathname, useRouter} from 'next/navigation';

import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';

const protectedPaths = [paths.chat, paths.setting];

export const RedirectPath = ({children}: {children: React.ReactNode}): React.ReactNode => {
  const pathname = usePathname();
  const router = useRouter();
  const {isAuthenticated} = useAuthContext();

  if (!protectedPaths.includes(pathname) && isAuthenticated) {
    router.push(paths.chat);
    return null;
  }

  return children;
};
