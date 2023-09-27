'use client';

import {useSearchParams} from 'next/navigation';

import {SettingsMenu} from './components/settings-menu';
import MyDetailPage from './my-details';
import PasswordPage from './password';
import GeneralSettings from './general-settings';
import TeamMembers from './team-members';

export default function SettingPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu') ?? 'details';

  return (
    <div className='h-screen py-[100px] bg-content-grey-100 rounded-b-[20px]'>
      <div className='max-w-[1200px] flex mx-auto'>
        <SettingsMenu />
        {menu === 'details' && <MyDetailPage />}
        {menu === 'password' && <PasswordPage />}
        {menu === 'general' && <GeneralSettings />}
        {menu === 'team-members' && <TeamMembers />}
      </div>
    </div>
  );
}
