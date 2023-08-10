'use client';

import {useEffect} from 'react';

import {usePathname, useRouter} from 'next/navigation';

import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';

export enum RedirectAction {
  Replace = 'Replace',
  Push = 'Push',
}

interface RedirectProps {
  to: string;
  action?: RedirectAction;
}

export const Redirect = ({to, action = RedirectAction.Push}: RedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    switch (action) {
      case RedirectAction.Push:
        router.replace(to);
        break;
      case RedirectAction.Replace:
        router.push(to);
        break;
    }
    router.replace(to);
  }, [action, router, to]);

  return null;
};

const protectedPaths = [paths.installation, paths.chat, paths.setting];

export const RedirectPathProvider = ({children}: {children: React.ReactNode}): React.ReactNode => {
  const pathname = usePathname();
  const {isAuthenticated} = useAuthContext();

  if (!protectedPaths.includes(pathname) && isAuthenticated) {
    return <Redirect to={paths.chat} action={RedirectAction.Replace} />;
  }

  if (!pathname.includes('auth') && !pathname.includes('installation') && !isAuthenticated) {
    return <Redirect to={paths.login} />;
  }

  return children;
};
