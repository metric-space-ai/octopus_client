import {Menu, Transition} from '@headlessui/react';
import {Fragment, MouseEvent, useEffect, useRef, useState} from 'react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';

const Permissions = [
  {
    id: 'per-1',
    label: 'Private user',
  },
  {
    id: 'per-2',
    label: 'Public user',
  },
];

export default function Dropdown() {
  const handleChangeValue = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
  };

  return (
    <div className='top-16 text-left'>
      <Menu as='div' className='relative inline-block text-left'>
        <div>
          <Menu.Button
            className='inline-flex w-full justify-center rounded-xs px-4 py-2 text-sm font-medium text-grey-900 bg-opacity-50 hover:bg-opacity-80 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-0 focus-visible:ring-opacity-75'
          >
            Public user
            <ChevronDownIcon
              className='ml-2 -mr-1 h-5 w-5 text-grey-600 hover:text-grey-800'
              aria-hidden='true'
            />
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
          <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xs bg-grey-0 shadow-lg ring-1 ring-grey-900 ring-opacity-5 focus:outline-none'>
            <div className='px-1 py-1'>
              {Permissions.map((elem) => (
                <Menu.Item>
                  {({active}) => (
                    <button 
                      onClick={(e) => handleChangeValue}
                      key={elem.id}
                      className={`${
                        active ? 'bg-primary text-grey-0' : 'text-grey-600'
                      } group flex w-full items-center rounded-xs px-2 py-2 text-xs leading-5`}
                    >
                      {elem.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
