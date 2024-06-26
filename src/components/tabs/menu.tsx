import {Fragment} from 'react';

import {Menu, Transition} from '@headlessui/react';
import {EllipsisVerticalIcon} from '@heroicons/react/24/outline';

interface TabMenuProps {
  onRename?: () => void;
  onDelete?: () => void;
}

export const TabMenu = ({onRename, onDelete}: TabMenuProps) => {
  return (
    <Menu as='div' className='z-10 relative ml-auto'>
      <Menu.Button className='flex w-full justify-center rounded-xs border-none' onClick={(e) => e.stopPropagation()}>
        <EllipsisVerticalIcon className='w-5 h-5 text-content-primary' />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className='absolute mt-4 -right-4 w-40 origin-top-right divide-y divide-gray-100 rounded-xs bg-grey-800 shadow-lg ring-1 ring-grey-900 ring-opacity-5 focus:outline-none'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='px-2 py-2 '>
            <Menu.Item>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-grey-900 text-grey-0' : 'text-grey-0'
                  } group flex w-full items-center rounded-xs px-2 py-2 text-sm`}
                  onClick={onRename}
                >
                  Rename
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <button
                  className={`${
                    active ? 'bg-grey-900 text-grey-0' : 'text-grey-0'
                  } group flex w-full items-center rounded-xs px-2 py-2 text-sm`}
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
