'use client';

import {useEffect, useState} from 'react';

import {
  AdjustmentsHorizontalIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  LightBulbIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {AxiosError} from 'axios';
import classNames from 'classnames';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import toast from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {ROLE_ADMIN, ROLE_COMPANY_ADMIN_USER} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import {getAppVersionApi} from '@/services/settings.service';
import {TRole} from '@/types';

const SIDEBAR: {
  id: string;
  tab_name: string;
  title: string;
  icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  permission: TRole;
}[] = [
  {
    id: 'tab_details',
    tab_name: 'details',
    title: 'My details',
    icon: UserIcon,
    permission: '',
  },
  {
    id: 'tab_password',
    tab_name: 'password',
    title: 'Password',
    icon: KeyIcon,
    permission: '',
  },
  {
    id: 'tab_general',
    tab_name: 'general',
    title: 'General',
    icon: Cog6ToothIcon,
    permission: '',
  },
  {
    id: 'tab_company',
    tab_name: 'company',
    title: 'Company',
    icon: BriefcaseIcon,
    permission: ROLE_COMPANY_ADMIN_USER,
  },
  {
    id: 'tab_documents',
    tab_name: 'documents',
    title: 'Documents',
    icon: DocumentDuplicateIcon,
    permission: '',
  },
  {
    id: 'tab_knowledge',
    tab_name: 'knowledge',
    title: 'Knowledge',
    icon: LightBulbIcon,
    permission: ROLE_COMPANY_ADMIN_USER,
  },
  {
    id: 'tab_team-members',
    tab_name: 'team-members',
    title: 'Team Members',
    icon: UsersIcon,
    permission: ROLE_COMPANY_ADMIN_USER,
  },
  {
    id: 'tab_sectors',
    tab_name: 'sectors',
    title: 'Sectors',
    icon: BuildingOfficeIcon,
    permission: ROLE_COMPANY_ADMIN_USER,
  },
  {
    id: 'tab_models',
    tab_name: 'models',
    title: 'Models',
    icon: CpuChipIcon,
    permission: ROLE_COMPANY_ADMIN_USER,
  },
  {
    id: 'tab_plugins',
    tab_name: 'plugins',
    title: 'Plugins',
    icon: ClipboardDocumentListIcon,
    permission: ROLE_COMPANY_ADMIN_USER,
  },
  {
    id: 'tab_parameters',
    tab_name: 'parameters',
    title: 'Parameters',
    icon: AdjustmentsHorizontalIcon,
    permission: '',
  },

  // {
  //   id: 'tab_apps',
  //   tab_name: 'apps',
  //   title: 'Apps',
  //   icon: CodeBracketIcon,
  //   permission: '',
  // },
];

export const SettingsMenu = () => {
  const [appVersion, setAppVersion] = useState('');
  const [versionIsLoading, setVersionIsLoading] = useState(false);
  const {user} = useAuthContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menu = searchParams.get('menu');

  const handleTab = (idx: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('menu', idx);
    router.replace(pathname + '?' + params.toString());
  };
  const getAppVersion = async () => {
    setVersionIsLoading(true);
    try {
      const {status, data} = await getAppVersionApi();

      if (status === 200) setAppVersion(data.version);
    } catch (err) {
      // setApps(beforeChange);
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setVersionIsLoading(false);
    }
  };
  useEffect(() => {
    getAppVersion();
  }, []);

  return (
    <div className='flex flex-col pl-3'>
      <div className='w-[240px] mt-9 px-6 py-4 gap-3 bg-grey-0 flex flex-col rounded-xl'>
        {SIDEBAR.map(
          (elem, index) =>
            (!elem.permission || user?.roles.includes(elem.permission || ROLE_ADMIN)) && (
              <Button
                key={elem.id}
                className='border border-transparent hover:border-grey-900 !pl-6 !justify-start !h-9 '
                variant={menu === elem.tab_name || (menu === null && index === 0) ? 'secondary' : 'transparent'}
                iconBefore={
                  <elem.icon
                    className={classNames(
                      'w-5 h-5',
                      menu === elem.tab_name || (menu === null && index === 0)
                        ? 'dark:text-grey-0 text-grey-0'
                        : 'dark:text-grey-900 text-grey-900',
                    )}
                  />
                }
                title={elem.title}
                onClick={() => handleTab(elem.tab_name)}
              />
            ),
        )}
        <span className='text-xxl font-semibold text-danger-300'>
          {versionIsLoading && !appVersion ? (
            <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-full h-8 '></div>
          ) : (
            appVersion
          )}
        </span>
      </div>
    </div>
  );
};
