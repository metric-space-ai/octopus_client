'use client';

import {useSearchParams} from 'next/navigation';

import {SettingsMenu} from './components/settings-menu';
import MyDetailPage from './my-details';
import PasswordPage from './password';
import GeneralSettings from './general-settings';
import TeamMembers from './team-members';
import Sectors from './sectors';
import {useAuthContext} from '@/contexts/authContext';
import {ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER} from '@/constant';
import {ShieldExclamationIcon} from '@heroicons/react/24/outline';
import Plugins from './pluggins';

export default function SettingPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu') ?? 'details';

  const {user} = useAuthContext();

  return (
    <div className='h-screen py-[100px] bg-content-grey-100 rounded-b-[20px]'>
      <div className='max-w-[1200px] flex mx-auto'>
        <SettingsMenu />
        {menu === 'details' && <MyDetailPage />}
        {menu === 'password' && <PasswordPage />}
        {menu === 'general' && <GeneralSettings />}
        {user?.roles.includes(ROLE_ADMIN || ROLE_COMPANY_ADMIN_USER) ? (
          <>
            {menu === 'team-members' && <TeamMembers />}
            {menu === 'sectors' && <Sectors />}
            {menu === 'plugins' && <Plugins />}
          </>
        ) : (
          (menu === 'team-members' || menu === 'sectors') && (
            <div className='w-full pt-24 px-7'>
              <div className='flex flex-col items-center justify-center w-full max-h-96 bg-white rounded-20 p-5'>
                <ShieldExclamationIcon className='text-red-500 mb-8' width={36} height={36} />
                <h1 className='font-poppins-semibold text-center text-xxl mb-6 text-content-accent-hover'>
                  Access Dinied
                </h1>
                <h2 className='font-poppins-semibold text-center text-xl mb-6 text-content-accent-400'>
                  Sorry, You Don't have Prmission
                </h2>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
