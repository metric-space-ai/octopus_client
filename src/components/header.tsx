import {Fragment, useEffect, useState, useRef} from 'react';

import {Menu, Transition} from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  LockClosedIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {UserIcon} from '@heroicons/react/24/solid';

import {usePathname, useRouter} from 'next/navigation';

import {Tab, Tabs, MoreTabs, MoreTab} from '@/components/tabs';
import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';
import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import {IconButton} from './buttons';
import {CreateNewTabModal, DeleteTabModal} from './modals';
import {ImagesBaseUrl} from '@/constant';


const MenuItem = () => {
  const {onLogout, user} = useAuthContext();

  return (
    <Menu as='div' className='z-10 relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center rounded-xs border-none'>
          <div className='w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-grey-0'>
            {user?.photo_file_name ? (
              <img src={`${ImagesBaseUrl}${user.photo_file_name}`} alt='user avatar' />
            ) : (
              <UserIcon className='w-6 h-6 text-grey-900' />
            )}
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 w-profile-drawer origin-top-right divide-y divide-gray-100 rounded-xl bg-grey-100 dark:bg-grey-800 shadow-lg border border-border/50 focus:outline-none'>
          <div className='px-2 py-2 gap-2 flex flex-col'>
            <Menu.Item as='div'>
              <div className={`rounded-lg bg-grey-0 dark:bg-grey-900 flex py-3 px-4`}>
                <div className='min-w-[36px] w-9 h-9 rounded-full overflow-hidden mr-2 flex justify-center items-center bg-grey-150 '>
                  {/* <h1 className='text-sky-600 text-lg text-center'>CN</h1> */}
                  {user?.photo_file_name ? (
                    <img src={`${ImagesBaseUrl}${user.photo_file_name}`} alt={user.name} />
                  ) : (
                    <UserIcon className='m-auto' width={32} height={32} />
                  )}
                </div>
                <div className='flex flex-col text-grey-800 dark:text-grey-0 truncate overflow-hidden'>
                  <h6 className='text-xs leading-5 font-semibold'>{user?.name}</h6>
                  <span className='text-xxs leading-4 font-normal'>{user?.job_title}</span>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item as='a' href={paths.setting}>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-grey-0 dark:bg-grey-900 text-grey-800 dark:text-grey-0' : 'text-grey-800 dark:text-grey-0'
                  } group flex w-full items-center rounded-xs pr-2 pl-5 py-2 text-sm`}
                >
                  <Cog8ToothIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                  Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-grey-0 dark:bg-grey-900 text-grey-800 dark:text-grey-0' : 'text-grey-800 dark:text-grey-0'
                  } group flex w-full items-center rounded-xs pr-2 pl-5 py-2 text-sm`}
                  onClick={onLogout}
                >
                  <ArrowRightOnRectangleIcon className='mr-2 h-5 w-5' aria-hidden='true' />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export const Header = () => {
  const tabItemRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const {user} = useAuthContext();
  const {workspaces, currentWorkspaceId, getWorkspaces, setWorkspaceId} = useChatStore();
  const [showCreateNewTabModal, setShowCreateNewTabModal] = useState(false);
  const [showDeleteabModal, setShowDeleteTabModal] = useState(false);
  const [fitNumberOfItems, setFitNumberOfItems] = useState(0);
  const [modalTab, setModalTab] = useState<IWorkspace | null>(null);
  const isAdmin = user?.roles.includes('ROLE_COMPANY_ADMIN_USER');
  const hasAccessToCreateWokspace = user?.roles.includes('ROLE_PRIVATE_USER');

  const handleTab = (idx: string) => {
    if (pathname === paths.setting) {
      router.push(paths.chat);
    }
    if (idx === currentWorkspaceId) {
      return;
    }
    setWorkspaceId(idx);
  };

  const handleAddNewTab = () => {
    setModalTab(null);
    setShowCreateNewTabModal(true);
  };

  useEffect(() => {
    getWorkspaces();
  }, [getWorkspaces]);
  useEffect(() => {
    // const fitNumber = Math.floor((tabItemRef.current.offsetWidth - 44) / 220 - 1);
    if (tabItemRef.current && workspaces.length > 8) {
      let size = Math.floor((tabItemRef.current.offsetWidth - 44) / 220 - 1);
      if (size < workspaces.length) size = Math.floor((tabItemRef.current.offsetWidth - 44) / 160 - 1);
      setFitNumberOfItems(size);
    }
  }, [workspaces]);

  return (
    <div className='flex justify-between items-center'>
      <div className='flex flex-1' ref={tabItemRef}>
        <Tabs selectedId={currentWorkspaceId} onChange={handleTab}>
          {workspaces?.map((tab, index) => {
            if (index < fitNumberOfItems || fitNumberOfItems === 0)
              return (
                <Tab
                  key={tab.id}
                  tabId={tab.id}
                  title={tab.name}
                  icon={
                    tab.type === 'Public' ? (
                      <div className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-400/10'>
                        <UserGroupIcon className='w-4 h-4 text-primary-400' />
                      </div>
                    ) : (
                      <div className='flex items-center justify-center w-7 h-7 rounded-full bg-secondary-600/10'>
                        <LockClosedIcon className='w-4 h-4 text-secondary-600' />
                      </div>
                    )
                  }
                  editMode={modalTab?.id === tab.id ? true : false}
                  editable={isAdmin}
                  tab={tab}
                  onClearTab={() => {
                    setModalTab(null);
                  }}
                  onRename={() => {
                    setModalTab(tab);
                    // setShowCreateNewTabModal(true);
                  }}
                  onDelete={() => {
                    setModalTab(tab);
                    setShowDeleteTabModal(true);
                  }}
                />
              );
          })}
        </Tabs>
        {fitNumberOfItems < workspaces.length && fitNumberOfItems > 0 && (
          <MoreTabs selectedId={currentWorkspaceId} onChange={handleTab} tabs={workspaces} itemsFrom={fitNumberOfItems}>
            {workspaces?.map((tab, index) => {
              if (index >= fitNumberOfItems)
                return (
                  <MoreTab
                    key={tab.id}
                    tabId={tab.id}
                    title={tab.name}
                    icon={
                      tab.type === 'Public' ? (
                        <div className='flex items-center justify-center w-7 h-7 rounded-full bg-primary-400/10'>
                          <UserGroupIcon className='w-4 h-4 text-primary-medium' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center w-7 h-7 rounded-full bg-secondary-700/15'>
                          <LockClosedIcon className='w-4 h-4 text-secondary-700' />
                        </div>
                      )
                    }
                    editMode={modalTab?.id === tab.id ? true : false}
                    editable={isAdmin}
                    tab={tab}
                    onClearTab={() => {
                      setModalTab(null);
                    }}
                    onRename={() => {
                      setModalTab(tab);
                      // setShowCreateNewTabModal(true);
                    }}
                    onDelete={() => {
                      setModalTab(tab);
                      setShowDeleteTabModal(true);
                    }}
                  />
                );
            })}
          </MoreTabs>
        )}
        {(isAdmin || hasAccessToCreateWokspace) && (
          <IconButton className='w-9 h-9 ml-2' variant='grey' onClick={handleAddNewTab}>
            <PlusIcon className='w-4 h-4 text-grey-900 dark:text-grey-50' />
          </IconButton>
        )}
      </div>
      <MenuItem />
      {user && (
        <CreateNewTabModal
          tab={modalTab}
          open={showCreateNewTabModal}
          roles={user.roles}
          onClose={() => setShowCreateNewTabModal(false)}
        />
      )}
      <DeleteTabModal tab={modalTab} open={showDeleteabModal} onClose={() => setShowDeleteTabModal(false)} />
    </div>
  );
};
