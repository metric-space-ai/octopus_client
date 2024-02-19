'use client';

import classNames from 'classnames';
import {usePathname} from 'next/navigation';

import {Header} from '@/components/header';
import {Loading} from '@/components/loading';
import {SideBar} from '@/components/sidebar';
import {paths} from '@/config/path';
import {useIsHydrated} from '@/hooks/useIsHydrated';

export default function ChatLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const hideSidebar = pathname === paths.setting;

  if (!useIsHydrated()) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='py-4 px-3 h-screen flex bg-content-black gap-4'>
      {!hideSidebar && <SideBar className={classNames(hideSidebar && '!hidden')} />}
      <div className='flex flex-col w-full'>
        <Header />
        {children}
      </div>
    </div>
  );
}
