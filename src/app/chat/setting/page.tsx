'use client';

import {useRouter, useSearchParams} from 'next/navigation';

import {SettingsMenu} from './components/settings-menu';
import MyDetailPage from './my-details';
import PasswordPage from './password';
import GeneralSettings from './general-settings';
import TeamMembers from './team-members';
import Sectors from './sectors';
import {useAuthContext} from '@/contexts/authContext';
import {ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER} from '@/constant';
import {ArrowUturnRightIcon, ShieldExclamationIcon, XMarkIcon} from '@heroicons/react/24/outline';
import Plugins from './pluggins';
import Documents from './documents';
import SettingsProvider from '@/contexts/settingsContext';
import {TRole} from '@/types';
import {Spinner} from '@/components/spinner';
import Applications from './apps';
import {Button, IconButton} from '@/components/buttons';
import {paths} from '@/config/path';

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
      <div className='h-screen py-[64px] bg-content-grey-100 rounded-b-[20px]'>

        <div
          onClick={handleExitSettings}
          className={
            'ml-auto mr-9 flex flex-col gap-1 items-center hover:underline [&>button]:hover:bg-content-accent/30 transition-all w-12 cursor-pointer'
          }
        >
          <IconButton className={'bg-content-accent/10'}>
            <XMarkIcon className={'w-5 h-5 text-content-black'} />
          </IconButton>
          <span>Back</span>
        </div>
        <div className='max-w-[1200px] flex mx-auto'>
          <SettingsMenu />
          {menu === 'details' && <MyDetailPage />}
          {menu === 'password' && <PasswordPage />}
          {menu === 'general' && <GeneralSettings />}
          {menu === 'documents' && <Documents />}
          {menu === 'apps' && <Applications />}
          {user?.roles.some((role) => [ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER].includes(role as TRole)) ? (
            <>
              {menu === 'team-members' && <TeamMembers />}
              {menu === 'sectors' && <Sectors />}
              {menu === 'plugins' && <Plugins />}
            </>
          ) : (
            (menu === 'team-members' || menu === 'sectors' || menu === 'plugins') && (
              <div className='w-full pt-24 px-7'>
                <div className='flex flex-col items-center justify-center w-full max-h-96 bg-white rounded-20 p-5'>
                  {authLoading ? (
                    <div className='flex gap-4 items-center'>
                      <Spinner size='medium' />
                      <h1 className='font-poppins-bold text-center text-xxl text-content-accent-hover'>Please Wait</h1>
                    </div>
                  ) : (
                    <>
                      <ShieldExclamationIcon className='text-red-500 mb-8' width={36} height={36} />
                      <h1 className='font-poppins-semibold text-center text-xxl mb-6 text-content-accent-hover'>
                        Access Dinied
                      </h1>
                      <h2 className='font-poppins-semibold text-center text-xl mb-6 text-content-accent-400'>
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
