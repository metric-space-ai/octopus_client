'use client';

import {XMarkIcon} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import {useRouter, useSearchParams} from 'next/navigation';

import {IconButton} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {paths} from '@/config/path';
import SettingsProvider from '@/contexts/settingsContext';

const DynamicSettingsMenu = dynamic(async () => (await import('./components/settings-menu')).SettingsMenu, {
  ssr: false,
  loading: () => (
    <div className='w-[240px] mt-9 flex flex-col items-center justify-center pl-3 bg-grey-50 animate-pulse h-[600px] rounded-xl'>
      <Spinner size='medium' />
    </div>
  ),
});
const DynamicSettingsPanel = dynamic(async () => (await import('./components/settings-panel')).default, {
  ssr: false,
  loading: () => (
    <div className='w-full mx-6 mt-9 flex flex-col items-center justify-center pl-3 bg-grey-50 animate-pulse h-[600px] rounded-xl'>
      <Spinner size='medium' />
    </div>
  ),
});

export default function SettingPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu') ?? 'details';
  const router = useRouter();
  const handleExitSettings = () => {
    router.push(paths.chat);
  };
  return (
    <SettingsProvider>
      <div className='h-full py-[64px] bg-grey-100 rounded-b-xl custom-scrollbar-thumb'>
        <div className='flex justify-between w-full items-center'>
          <h1 className='text-32 font-semibold pl-6'>Settings</h1>

          <div
            onClick={handleExitSettings}
            className={
              'ml-auto mr-9 flex flex-col gap-1 items-center hover:underline [&>button]:hover:bg-primary/30 transition-all w-12 cursor-pointer'
            }
          >
            <IconButton className={'bg-primary/10'}>
              <XMarkIcon className={'w-5 h-5 text-grey-900'} />
            </IconButton>
            <span>Back</span>
          </div>
        </div>
        <div className='max-w-[1200px] flex mx-auto'>
          <DynamicSettingsMenu />
          <DynamicSettingsPanel menu={menu} />
        </div>
      </div>
    </SettingsProvider>
  );
}
