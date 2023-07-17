'use client';

import {useSearchParams} from 'next/navigation';

import {SettingsMenu} from './components/settings-menu';
import MyDetailPage from './my-details';
import PasswordPage from './password';

export default function SettingPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu') ?? 'details';

  return (
    <div className='h-screen py-[100px] bg-content-grey-100'>
      <div className='max-w-[1200px] flex mx-auto'>
        <SettingsMenu />
        {menu === 'details' && <MyDetailPage />}
        {menu === 'password' && <PasswordPage />}
        {menu === 'general' && <MyDetailPage />}
      </div>
    </div>
  );
}
