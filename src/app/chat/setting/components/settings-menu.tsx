'use client';

import {Cog6ToothIcon, KeyIcon, UserIcon, UsersIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import {Button} from '@/components/buttons';
import {VERSION_NUM} from '@/constant';

const SIDEBAR = [
  {
    id: 'tab_details',
    tab_name: 'details',
    title: 'My details',
    icon: UserIcon,
    permission: 'user',
  },
  {
    id: 'tab_password',
    tab_name: 'password',
    title: 'Password',
    icon: KeyIcon,
    permission: 'user',
  },
  {
    id: 'tab_general',
    tab_name: 'general',
    title: 'General',
    icon: Cog6ToothIcon,
    permission: 'user',
  },
  {
    id: 'tab_team-members',
    tab_name: 'team-members',
    title: 'Team Members',
    icon: UsersIcon,
    permission: 'admin',
  },
];

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
      <h1 className='text-32 font-semibold font-poppins-semibold'>Settings</h1>
      <div className='w-[240px] mt-9 px-6 py-4 gap-3 bg-content-white flex flex-col rounded-[20px]'>
        {SIDEBAR.map((elem, index) => (
          <Button
            key={elem.id}
            className='border border-transparent hover:border-black !pl-6 !justify-start !h-9'
            variant={menu === elem.tab_name || (menu === null && index === 0) ? 'secondary' : 'transparent'}
            iconBefore={
              <elem.icon
                className={classNames(
                  'w-5 h-5',
                  menu === elem.tab_name || (menu === null && index === 0)
                    ? 'text-content-white'
                    : 'text-content-black',
                )}
              />
            }
            title={elem.title}
            onClick={() => handleTab(elem.tab_name)}
          />
        ))}
        <span className='text-xxl font-semibold text-content-red-400'>{VERSION_NUM}</span>
      </div>
    </div>
  );
};
