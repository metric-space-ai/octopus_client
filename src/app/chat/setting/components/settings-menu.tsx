'use client';

import {Cog6ToothIcon, KeyIcon, UserIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import {Button} from '@/components/buttons';
import {VERSION_NUM} from '@/constant';

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
      <h1 className='text-32 font-semibold font-poppins-semibold'>
        Settings
      </h1>
      <div className='w-[240px] mt-9 px-6 py-4 gap-3 bg-content-white flex flex-col rounded-[20px]'>
        <Button className='border border-transparent hover:border-black !pl-6 !justify-start'
          variant={menu === 'details' || menu === null ? 'secondary' : 'transparent'}
          iconBefore={
            <UserIcon
              className={classNames('w-5 h-5', menu === 'details' ? 'text-content-white' : 'text-content-black')}
            />
          }
          title='My details'
          onClick={() => handleTab('details')}
        />
        <Button className='border border-transparent hover:border-black !pl-6 !justify-start'
          variant={menu === 'password' ? 'secondary' : 'transparent'}
          iconBefore={
            <KeyIcon
              className={classNames('w-5 h-5', menu === 'password' ? 'text-content-white' : 'text-content-black')}
            />
          }
          title='Password'
          onClick={() => handleTab('password')}
        />
        <Button className='border border-transparent hover:border-black !pl-6 !justify-start'
          variant={menu === 'general' ? 'secondary' : 'transparent'}
          iconBefore={
            <Cog6ToothIcon
              className={classNames('w-5 h-5', menu === 'general' ? 'text-content-white' : 'text-content-black')}
            />
          }
          title='General'
          onClick={() => handleTab('general')}
        />
        <span className='text-xxl font-semibold text-content-red-400'>{VERSION_NUM}</span>
      </div>
    </div>
  );
};
