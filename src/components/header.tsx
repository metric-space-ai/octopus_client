import {Fragment, useEffect, useState} from 'react';

import {Menu, Transition} from '@headlessui/react';
import {ArrowLeftOnRectangleIcon, Cog8ToothIcon, UserCircleIcon} from '@heroicons/react/24/outline';

import {Tab, Tabs} from '@/components/tabs';
import {useWorkspaceStore} from '@/store';

const MenuItem = () => {
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
            <Menu.Item>
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
  const {workspaces, getWorkspaces} = useWorkspaceStore();
  const [selectedTabIndex, setSelectedTabIndex] = useState('tab1');

  useEffect(() => {
    getWorkspaces();
  }, [getWorkspaces]);

  const handleTab = (idx: string) => {
    setSelectedTabIndex(idx);
  };

  return (
    <div className='flex justify-between items-center'>
      <div className='flex'>
        <Tabs selectedId={selectedTabIndex} onChange={handleTab}>
          {workspaces?.map((tab) => (
            <Tab key={tab.id} tabId={tab.id} title={tab.name} />
          ))}
        </Tabs>
      </div>
      <MenuItem />
    </div>
  );
};
