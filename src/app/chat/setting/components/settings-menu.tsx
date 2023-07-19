'use client';

import {Tab} from '@headlessui/react';
import {Cog6ToothIcon, KeyIcon, UserIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import {Button} from '@/components/buttons';

export const SettingsMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu');

  const handleTab = (idx: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('menu', idx);
    router.replace(pathname + '?' + params.toString());
  };

  return (
    <div className='flex flex-col'>
      <h1 className='text-32 font-semibold'>Setting</h1>
      <div className='w-[240px] mt-9 px-6 py-4 gap-3 bg-content-white flex flex-col rounded-[20px]'>
        <Button
          variant={menu === 'details' ? 'secondary' : 'transparent'}
          iconBefore={
            <UserIcon
              className={classNames('w-5 h-5', menu === 'details' ? 'text-content-white' : 'text-content-black')}
            />
          }
          title='My details'
          onClick={() => handleTab('details')}
        />
        <Button
          variant={menu === 'password' ? 'secondary' : 'transparent'}
          iconBefore={
            <KeyIcon
              className={classNames('w-5 h-5', menu === 'password' ? 'text-content-white' : 'text-content-black')}
            />
          }
          title='Password'
          onClick={() => handleTab('password')}
        />
        <Button
          variant={menu === 'general' ? 'secondary' : 'transparent'}
          iconBefore={
            <Cog6ToothIcon
              className={classNames('w-5 h-5', menu === 'general' ? 'text-content-white' : 'text-content-black')}
            />
          }
          title='General'
          onClick={() => handleTab('general')}
        />
      </div>
    </div>
  );
};
