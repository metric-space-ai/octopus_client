'use client';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';

import {Header} from '@/components/header';
import {Loading} from '@/components/loading';
// import {SideBar} from '@/components/sidebar';
import {paths} from '@/config/path';
import {useIsHydrated} from '@/hooks/useIsHydrated';

const DynamicSideBar = dynamic(async () => (await import('@/components/sidebar')).SideBar, {
  ssr: false,
  loading: () => (
    <div className='w-[320px] h-full hidden sm:flex flex-col px-4 py-6 border-box rounded-xl bg-grey-50 dark:bg-grey-400' />
  ),
});

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
    <div className='py-4 px-3 h-screen flex bg-grey-0 dark:bg-grey-900 gap-3'>
      {!hideSidebar && <DynamicSideBar className={classNames(hideSidebar && '!hidden')} />}
      <div className='flex flex-col w-full'>
        <Header />
        {children}
      </div>
    </div>
  );
}
