import React from 'react';

import {ShieldExclamationIcon} from '@heroicons/react/24/outline';

import {Spinner} from '@/components/spinner';
import {ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import {TRole} from '@/types';

import Companies from '../companies';
import Documents from '../documents';
import GeneralSettings from '../general-settings';
import KnowledgeBooks from '../knowledge';
import Models from '../models';
import MyDetailPage from '../my-details';
import Parameters from '../parameters';
import PasswordPage from '../password';
import Plugins from '../pluggins';
import Sectors from '../sectors';
import TeamMembers from '../team-members';
import ThemeSettings from '../theme-settings';

type Props = {
  menu: string;
};

const SettingsPanel = ({menu}: Props) => {
  const {user, authLoading} = useAuthContext();

  return (
    <>
      {menu === 'details' && <MyDetailPage />}
      {menu === 'password' && <PasswordPage />}
      {menu === 'general' && <GeneralSettings />}
      {menu === 'documents' && <Documents />}
      {menu === 'parameters' && <Parameters />}
      {/* {menu === 'apps' && <Applications />} */}
      {user?.roles.some((role) => [ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER].includes(role as TRole)) ? (
        <>
          {menu === 'knowledge' && <KnowledgeBooks />}
          {menu === 'team-members' && <TeamMembers />}
          {menu === 'sectors' && <Sectors />}
          {menu === 'models' && <Models />}
          {menu === 'plugins' && <Plugins />}
          {menu === 'theme' && <ThemeSettings />}
          {menu === 'company' && <Companies />}
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
                    {`Sorry, You Don't have Prmission`}
                  </h2>
                </>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SettingsPanel;
