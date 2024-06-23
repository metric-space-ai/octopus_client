'use client';

import {useRouter, useSearchParams} from 'next/navigation';

import {SettingsMenu} from './components/settings-menu';

import MyDetailPage from './my-details';
import PasswordPage from './password';
import GeneralSettings from './general-settings';
import TeamMembers from './team-members';
import Sectors from './sectors';
import Plugins from './pluggins';
import ThemeSettings from './theme-settings';
import Documents from './documents';
import Parameters from './parameters';
import SettingsProvider from '@/contexts/settingsContext';

import {TRole} from '@/types';
import {Spinner} from '@/components/spinner';
// import Applications from './apps';
import {useAuthContext} from '@/contexts/authContext';
import {ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER} from '@/constant';
import {ShieldExclamationIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {IconButton} from '@/components/buttons';
import {paths} from '@/config/path';
import Models from './models';

export default function SettingPage() {
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu') ?? 'details';
  const router = useRouter();

  const {user, authLoading} = useAuthContext();

  const handleExitSettings = () => {
    router.push(paths.chat);
  };
  return (
    <SettingsProvider>
      <div className='h-screen py-[64px] bg-grey-100 rounded-b-xl'>
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
        <div className='max-w-[1200px] flex mx-auto'>
          <SettingsMenu />
          {menu === 'details' && <MyDetailPage />}
          {menu === 'password' && <PasswordPage />}
          {menu === 'general' && <GeneralSettings />}
          {menu === 'documents' && <Documents />}
          {menu === 'parameters' && <Parameters />}
          {/* {menu === 'apps' && <Applications />} */}
          {user?.roles.some((role) => [ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER].includes(role as TRole)) ? (
            <>
              {menu === 'team-members' && <TeamMembers />}
              {menu === 'sectors' && <Sectors />}
              {menu === 'models' && <Models />}
              {menu === 'plugins' && <Plugins />}
              {menu === 'theme' && <ThemeSettings />}
            </>
          ) : (
            ['team-members', 'sectors', 'plugins', 'theme'].includes(menu) && (
              <div className='w-full pt-24 px-7'>
                <div className='flex flex-col items-center justify-center w-full max-h-96 bg-grey-0 rounded-xl p-5'>
                  {authLoading ? (
                    <div className='flex gap-4 items-center'>
                      <Spinner size='medium' />
                      <h1 className='font-bold text-center text-xxl text-primary-medium'>Please Wait</h1>
                    </div>
                  ) : (
                    <>
                      <ShieldExclamationIcon className='text-danger mb-8' width={36} height={36} />
                      <h1 className='font-semibold text-center text-xxl mb-6 text-primary-medium'>Access Dinied</h1>
                      <h2 className='font-semibold text-center text-xl mb-6 text-primary-400'>
                        Sorry, You Don't have Prmission
                      </h2>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </SettingsProvider>
  );
}
