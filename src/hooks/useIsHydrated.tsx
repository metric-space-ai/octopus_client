import {useEffect, useLayoutEffect, useState} from 'react';

// https://ahooks.js.org/guide/blog/ssr/

const isSSR = typeof window === 'undefined';
const useIsomorphicLayoutEffect = isSSR ? useEffect : useLayoutEffect;

// Avoid hydration mismatch warning
export const useIsHydrated = (): boolean => {
  const [isHydrated, setIsHydrated] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
};
