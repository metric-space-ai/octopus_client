import {Fragment, useEffect, useState} from 'react';

import {Menu, Transition} from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  Cog8ToothIcon,
  LockClosedIcon,
  PlusIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {usePathname, useRouter} from 'next/navigation';

import {Tab, Tabs} from '@/components/tabs';
import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';
import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import {IconButton} from './buttons';
import {CreateNewTabModal, DeleteTabModal} from './modals';

const MenuItem = () => {
  const {onLogout} = useAuthContext();

  return (
    <Menu as='div' className='z-10 relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center rounded-md border-none'>
          <UserCircleIcon className='w-8 h-8 text-white' />
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
        <Menu.Items className='absolute right-0 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-content-grey-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='px-2 py-2 '>
            <Menu.Item as='a' href={paths.setting}>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-content-black text-white' : 'text-white'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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
                    active ? 'bg-content-black text-white' : 'text-white'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={onLogout}
                >
                  <ArrowLeftOnRectangleIcon className='mr-2 h-5 w-5' aria-hidden='true' />
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
  const pathname = usePathname();
  const router = useRouter();
  const {user} = useAuthContext();
  const {workspaces, currentWorkspaceId, getWorkspaces, setWorkspaceId} = useChatStore();
  const [showCreateNewTabModal, setShowCreateNewTabModal] = useState(false);
  const [showDeleteabModal, setShowDeleteTabModal] = useState(false);
  const [modalTab, setModalTab] = useState<IWorkspace | null>(null);
  const isAdmin = user?.roles.includes('ROLE_COMPANY_ADMIN_USER');

  useEffect(() => {
    getWorkspaces();
  }, [getWorkspaces]);

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

  return (
    <div className='flex justify-between items-center'>
      <div className='flex'>
        <Tabs selectedId={currentWorkspaceId} onChange={handleTab}>
          {workspaces?.map((tab) => (
            <Tab
              key={tab.id}
              tabId={tab.id}
              title={tab.name}
              icon={
                tab.type === 'Public' ? (
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-content-accent-400/10'>
                    <UserGroupIcon className='w-4 h-4 text-content-accent-400' />
                  </div>
                ) : (
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-content-blue-light/10'>
                    <LockClosedIcon className='w-4 h-4 text-content-blue-light' />
                  </div>
                )
              }
              editable={isAdmin}
              onRename={() => {
                setModalTab(tab);
                setShowCreateNewTabModal(true);
              }}
              onDelete={() => {
                setModalTab(tab);
                setShowDeleteTabModal(true);
              }}
            />
          ))}
        </Tabs>
        {isAdmin && (
          <IconButton className='w-9 h-9 ml-2 !bg-content-grey-900' onClick={handleAddNewTab}>
            <PlusIcon className='w-4 h-4 text-content-white' />
          </IconButton>
        )}
      </div>
      <MenuItem />
      <CreateNewTabModal tab={modalTab} open={showCreateNewTabModal} onClose={() => setShowCreateNewTabModal(false)} />
      <DeleteTabModal tab={modalTab} open={showDeleteabModal} onClose={() => setShowDeleteTabModal(false)} />
    </div>
  );
};
