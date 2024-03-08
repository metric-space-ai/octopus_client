import React, {Fragment, useEffect, useState} from 'react';
import {IPlugin, IUser, TRole} from '@/types';
import {Listbox, Transition} from '@headlessui/react';
import {ImagesBaseUrl, ROLESARRAYVALUE, ROLESLABEL, ROLE_ADMIN} from '@/constant';
// import {useSettingsContext} from '@/contexts/settingsContext';

import {CheckIcon, ChevronDownIcon, LockClosedIcon, TrashIcon, UserIcon} from '@heroicons/react/24/outline';
import {useDispatch} from 'react-redux';
import {updateTeamMember} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {AppDispatch} from '@/app/lib/store';

type Props = {
  user: IUser;
  deleteUser: (member: IUser) => void;
  resetUserPassword: (member: IUser) => void;
  plugins: IPlugin[] | undefined;
  pluginsIsLoading: boolean;
};

export const TeamMemberTableRow = ({user, deleteUser, plugins, pluginsIsLoading, resetUserPassword}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [roleIsLoading, setRoleIsLoading] = useState(false);

  const handleChangeUserRole = async (roles: TRole[]) => {
    if (roles.includes(ROLE_ADMIN)) return;
    const payload = {
      ...user,
      roles,
    };

    setRoleIsLoading(true);
    try {
      dispatch(updateTeamMember(payload));
      // await updateTeamMember(payload);
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
    <div className='gap-2 py-3 h-68-px border-b-content-grey-100 border-b flex'>
      <div className='flex gap-4 w-[224px] '>
        {/* <img src={userImageSample.src} className='rounded-full w-11 h-11' /> */}
        <div className='flex items-center justify-center w-11 h-11 bg-content-accent-light-11 rounded-full overflow-hidden'>
          {user.profile?.photo_file_name ? (
            <img
              src={`${ImagesBaseUrl}public/${user.profile.photo_file_name}`}
              alt={user.profile.name}
              className='object-cover'
              width={45}
              height={45}
            />
          ) : (
            <UserIcon className='text-content-accent-hover' width={45} height={45} />
          )}
        </div>
        <div className={`flex flex-col gap-0.5 ${user.is_enabled ? 'justify-start' : 'justify-center'}`}>
          {user.is_enabled && <h6 className='font-semibold text-xs leading-5'>{user.profile?.name}</h6>}
          <p
            className={`font-normal text-xs leading-5 w-[165px] truncate ... ${
              user.is_enabled ? 'text-content-grey-900' : 'text-content-grey-600'
            }`}
          >
            {user.email}
          </p>
        </div>
      </div>

      <span
        className={`h-full flex items-center text-xs leading-5 w-[110px]  ${
          user.is_enabled ? 'text-content-grey-900' : 'text-content-grey-600'
        }`}
      >
        {user.is_enabled ? getDateFormat(user.created_at) : 'Invitation pending'}
      </span>
      <div className='w-[122px] flex justify-start items-center'>
        {roleIsLoading ? (
          <div className='flex justify-start py-3 items-center animate-pulse'>
            <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-36 h-10'></div>
          </div>
        ) : (
          <Listbox value={user.roles} onChange={handleChangeUserRole} multiple>
            <div className='mt-1'>
              <Listbox.Button className='relative w-[122px] cursor-default rounded-[48px] bg-white py-2 pl-3 pr-10 text-left text-content-primary border'>
                <span
                  className='block text-xs text-content-grey-900 w-[98px] h-4 leading-4 truncate ...'
                  title={user.roles.map((role) => ROLESLABEL[role]).join(', ')}
                >
                  {user.roles.map((role) => ROLESLABEL[role]).join(', ')}
                </span>

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
      </div>

      <span className='ml-auto cursor-pointer flex items-center gap-4'>
        <LockClosedIcon
          width={16}
          height={16}
          className='text-content-grey-600 hover:text-content-grey-900'
          onClick={() => resetUserPassword(user)}
        />
        <TrashIcon
          width={16}
          height={16}
          className='text-content-grey-600 hover:text-content-grey-900'
          onClick={() => deleteUser(user)}
        />
      </span>
    </div>
  );
};
