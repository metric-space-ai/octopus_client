import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';
import React, {useState, Fragment} from 'react';

import {Listbox, Transition} from '@headlessui/react';

import userImageSample from './../../../../../public/images/user-sample.png';
import {CheckIcon, ChevronDownIcon, TrashIcon} from '@heroicons/react/24/outline';

import {RoleOptions} from '@/constant';

type Props = {};

type User = {
  id: string;
  active: boolean;
  fullname: string;
  email: string;
  date: string;
  role: string;
};

type Role = {value: ''; label: ''};
const USERS: User[] = [
  {
    id: 'use-1',
    active: true,
    fullname: 'Jenny Wilson',
    email: 'jenny.wilson@gmail.com',
    date: '15 Jul, 2023',
    role: 'ROLE_ADMIN',
  },
  {
    id: 'use-2',
    active: true,
    fullname: 'Cody Fisher',
    email: 'cody.fisher@gmail.com',
    date: '23 Jul, 2023',
    role: 'ROLE_PRIVATE_USER',
  },
  {
    id: 'use-3',
    active: true,
    fullname: 'Michelle Rivera',
    email: 'michelle.rivera@gmail.com',
    date: '19 Jul, 2023',
    role: 'ROLE_PRIVATE_USER',
  },
  {
    id: 'use-4',
    active: false,
    fullname: '',
    email: 'sarol.smith@gmail.com',
    date: '',
    role: 'ROLE_ADMIN',
  },
];
const TeamMebersTable = (props: Props) => {
  const [users, setUsers] = useState(USERS);
  const handleChageUserPermissions = (data: Role, user: User) => {
    const result = [...users];
    const index = result.findIndex((elem) => elem.id === user.id);
    result[index].role = data.value;
    setUsers(result);
  };

  return (
    <table className='table-auto w-[608px] max-w-full'>
      <thead>
        <tr className='h-7'>
          <th className='text-content-grey-600 text-xs font-normal text-left'>Name</th>
          <th className='text-content-grey-600 text-xs font-normal px-3 text-center'>
            <div
              className='flex items-center justify-center cursor-pointer hover:text-content-grey-900'
              onClick={() => console.log('sort it dude :)')}
            >
              Date added
              <ArrowsUpDownIcon width={9} height={9} className='text-content-grey-600 ml-1.5' />
            </div>
          </th>
          <th className='text-content-grey-600 text-xs font-normal text-left'>User role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
            <td>
              <div className='flex gap-4'>
                <img src={userImageSample.src} className='rounded-full w-11 h-11' />
                <div className={`flex flex-col gap-0.5 ${user.active ? 'justify-start' : 'justify-center'}`}>
                  {user.active && user.fullname && <h6 className='font-semibold text-xs leading-5'>{user.fullname}</h6>}
                  <p
                    className={`font-normal text-xs leading-5 ${
                      user.active ? 'text-content-grey-900' : 'text-content-grey-600'
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
            </td>
            <td>
              <span
                className={`w-full h-full flex items-center justify-center text-xs leading-5 ${
                  user.active ? 'text-content-grey-900' : 'text-content-grey-600'
                }`}
              >
                {user.active ? user.date : 'Invitation pending'}
              </span>
            </td>
            <td>
              <div className='flex justify-start items-center'>

                {/* <CustomSelect className='w-36 text-content-black'
                  options={RoleOptions}
                  value={user.role}
                  onChange={(v: any) => handleChageUserPermissions(v, user)}
                /> */}
                
                <Listbox value={user.role} onChange={(v: any) => handleChageUserPermissions(v, user)}>
                  <div className='relative mt-1'>
                    <Listbox.Button className='cursor-pointer relative w-full rounded-[48px] bg-white py-2 pl-5 pr-10 text-left text-content-primary hover:text-content-grey-900'>
                      <div className='flex gap-1 items-center'>
                        <span className='text-xs text-content-black font-normal w-20'>
                          {RoleOptions.find((role) => role.value === user.role)?.label}
                        </span>
                      </div>
                      <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-content-grey-600'>
                        <ChevronDownIcon className='w-2.5 h-2.5 text-gray-400' aria-hidden='true' />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave='transition ease-in duration-100'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Listbox.Options className='z-10 shadow-sm absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-content-primary'>
                        {RoleOptions.map((permission, idx) => (
                          <Listbox.Option
                            key={`${permission.value}_${idx}`}
                            className={({active}) =>
                              `relative select-none py-2 pl-10 pr-4 ${active ? 'bg-content-grey-100' : 'text-gray-900'}`
                            }
                            value={permission}
                          >
                            {({selected}) => {
                              return (
                                <>
                                  <span className='block truncate text-xs'>{permission.label}</span>
                                  {selected || permission.value === user.role ? (
                                    <span className='text-xs absolute inset-y-0 left-0 flex items-center pl-3 text-content-primary'>
                                      <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                    </span>
                                  ) : null}
                                </>
                              );
                            }}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <span className='ml-auto cursor-pointer'>
                  <TrashIcon
                    width={16}
                    height={16}
                    className='text-content-grey-600 hover:text-content-grey-900'
                    onClick={() => console.log('remove it')}
                  />
                </span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamMebersTable;
