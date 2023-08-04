import {useRouter} from 'next/router';
import {useEffect} from 'react';

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
