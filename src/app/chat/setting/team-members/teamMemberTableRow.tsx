import React, {Fragment, useState} from 'react';
import {IUser, TRole} from '@/types';
import {Listbox, Transition} from '@headlessui/react';
import {ROLESARRAYVALUE, ROLESLABEL, ROLE_ADMIN} from '@/constant';
import {useSettingsContext} from '@/contexts/settingsContext';

import userImageSample from './../../../../../public/images/user-sample.png';
import {CheckIcon, ChevronDownIcon, TrashIcon} from '@heroicons/react/24/outline';

type Props = {
  user: IUser;
};

export const TeamMemberTableRow = ({user}: Props) => {
  const [roleIsLoading, setRoleIsLoading] = useState(false);
  const {updateTeamMember, deleteTeamMember} = useSettingsContext();

  const handleChangeUserRole = async (roles: TRole[]) => {
    if (roles.includes(ROLE_ADMIN)) return;
    setRoleIsLoading(true);
    const payload = {
      ...user,
      roles,
    };

    try {
      await updateTeamMember(payload);
    } catch (err) {
    } finally {
      setRoleIsLoading(false);
    }
  };
  const getDateFormat = (dateString = '') => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    let monthName = months[date.getMonth()];
    return `${date.getDate()} ${monthName}, ${date.getFullYear()}`;
  };
  return (
    <tr key={user.id} className='px-[2.5px] py-3 h-68-px border-b-content-grey-100 border-b'>
      <td>
        <div className='flex gap-4'>
          <img src={userImageSample.src} className='rounded-full w-11 h-11' />
          <div className={`flex flex-col gap-0.5 ${user.is_enabled ? 'justify-start' : 'justify-center'}`}>
            {/* {user.is_enabled && (
            <h6 className='font-semibold text-xs leading-5'>{user.}</h6>
          )} */}
            <p
              className={`font-normal text-xs leading-5 ${
                user.is_enabled ? 'text-content-grey-900' : 'text-content-grey-600'
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
            user.is_enabled ? 'text-content-grey-900' : 'text-content-grey-600'
          }`}
        >
          {user.is_enabled ? getDateFormat(user.created_at) : 'Invitation pending'}
        </span>
      </td>
      <td>
        <div className='flex justify-start items-center'>
          {roleIsLoading ? (
            <div className='flex justify-start py-3 items-center animate-pulse'>
              <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-36 h-10'></div>
            </div>
          ) : (
            <Listbox value={user.roles} onChange={handleChangeUserRole} multiple>
              <div className='mt-1'>
                <Listbox.Button className='relative w-full cursor-default rounded-[48px] bg-white py-2 pl-5 pr-10 text-left text-content-primary border'>
                  <div className='flex gap-1 items-center'>
                    <span className='text-base text-content-grey-900'>
                      {/* {selected.map((role) => role.label).join(', ')} */}
                      User Roles
                    </span>
                  </div>

                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                    <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-content-primary z-10 shadow-md'>
                    {ROLESARRAYVALUE.map((permission, idx) => (
                      <Listbox.Option
                        key={`${permission}_${idx}`}
                        className={({active}) =>
                          `relative select-none py-2 pl-10 pr-4 ${active ? 'bg-content-grey-100' : 'text-gray-900'} ${
                            permission === ROLE_ADMIN
                              ? 'focus:outline-none opacity-50 bg-content-grey-100 hover:bg-content-grey-100'
                              : 'cursor-pointer'
                          }`
                        }
                        value={permission}
                      >
                        {({selected}) => (
                          <>
                            <span className='block truncate' title={ROLESLABEL[permission]}>
                              {ROLESLABEL[permission]}
                            </span>
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-content-primary'>
                                <CheckIcon className='h-5 w-5' aria-hidden='true' />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          )}
          <span className='ml-auto cursor-pointer'>
            <TrashIcon
              width={16}
              height={16}
              className='text-content-grey-600 hover:text-content-grey-900'
              onClick={() => deleteTeamMember(user.id)}
            />
          </span>
        </div>
      </td>
    </tr>
  );
};
