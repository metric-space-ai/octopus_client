import {useEffect, Fragment} from 'react';
import {Disclosure, Listbox, Transition} from '@headlessui/react';

import {TrashIcon, ChevronDownIcon, CheckIcon} from '@heroicons/react/24/outline';
import CustomSwitch from '@/components/switch/custom-switch';
import {IWaspApp} from '@/types';
import {useSelector, useDispatch} from 'react-redux';
import {
  getAllWaspApps,
  updateWaspApp,
  handleChangeSelectedWaspApp,
  handleChangeOpenRemoveWaspAppDialog,
  putAllowedUsersForWaspAppAccess,
} from '@/app/lib/features/waspApps/waspAppsSlice';

import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import Highlight from 'react-highlight';

import './../../../../assets/atelier-cave-dark.css';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {AppDispatch} from '@/app/lib/store';

type Props = {
  handleOpenExistedWaspAppModal: (waspApp: IWaspApp) => void;
};
export default function WaspAppsDetails({handleOpenExistedWaspAppModal}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: waspApps, isLoading, reloadWaspAppIsAvailable} = useSelector(selectWaspApps);
  const {entities: allUsers, isLoading: usersIsLoading} = useSelector(selectTeamMembers);

  const handleChangeWaspAppActivation = async (app: IWaspApp, check: boolean) => {
    if (!waspApps) return;
    const payload: IWaspApp = {...app, is_enabled: check};
    dispatch(updateWaspApp(payload));
  };

  const handleChangeUserWaspAccess = (wasp_id: string, allowedUsers: IWaspApp[]) => {
    if (allowedUsers.length === 0) {
      dispatch(putAllowedUsersForWaspAppAccess({wasp_id, allowedUsers: []}));
    } else {
      const userIds: string[] = allowedUsers.map((user) => user.id);
      dispatch(putAllowedUsersForWaspAppAccess({wasp_id, allowedUsers: userIds}));
    }
  };
  const handleOpenDeleteWaspAppModal = (waspApp: IWaspApp) => {
    dispatch(handleChangeSelectedWaspApp(waspApp));
    dispatch(handleChangeOpenRemoveWaspAppDialog(true));
  };

  useEffect(() => {
    dispatch(getAllWaspApps());
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='w-full custom-scrollbar-thumb'>
        <div className='flex mb-2'>
          <div className='w-[150px]'>
            <span
              className='font-medium text-xs leading-5 text-grey-600'
              onClick={() => console.log({waspApps})}
            >
              Name
            </span>
          </div>
          <div className='w-28'>
            <span className='font-medium text-xs leading-5 text-grey-600 '>Description</span>
          </div>
          <div className='w-28'>
            <span className='font-medium text-xs leading-5 text-grey-600 '>Formatted name</span>
          </div>
          <div className='w-32'>
            <span className='font-medium text-xs leading-5 text-grey-600 '>Users</span>
          </div>
          <div className='w-20 flex justify-center'>
            <span className='font-medium text-xs leading-5 text-grey-600 '>On/Off</span>
          </div>
        </div>

        <div className='h-[280px] min-w-[570px] overflow-auto custom-scrollbar-thumb'>
          {reloadWaspAppIsAvailable && (
            <div className='w-full'>
              <h2
                className='uppercase text-primary cursor-pointer text-center py-6 hover:underline'
                onClick={() => getAllWaspApps()}
              >
                try again
              </h2>
            </div>
          )}
          {!waspApps || waspApps.length === 0
            ? !isLoading && (
                <div className='flex justify-center py-3 items-center border-t'>
                  <h2 className='text-lg text-primary uppercase'>not found</h2>
                </div>
              )
            : waspApps.map((app, index) => (
                <Disclosure key={app.id}>
                  {({open}) => (
                    <>
                      <div className='flex justify-start py-3 items-center border-t'>
                        <div className='flex gap-3 w-[150px] items-center'>
                          <div className={`flex items-center flex-1`}>
                            <p
                              className='text-xs leading-5 h-5 text-grey-900 font-semibold w-36 truncate ...'
                              title={app.name}
                            >
                              {app.name}
                            </p>
                          </div>
                        </div>

                        <div className='flex w-28 pr-1.5'>
                          <p
                            className='text-xxs  leading-4 h-4 text-grey-800 font-medium truncate ...'
                            title={app.description}
                          >
                            {app.description}
                          </p>
                        </div>

                        <div className='flex w-28 pr-1.5'>
                          <p
                            className='text-xxs  leading-4 h-4 text-grey-800 font-medium truncate ...'
                            title={app.formatted_name}
                          >
                            {app.formatted_name}
                          </p>
                        </div>

                        <div className='w-32 flex justify-start items-center'>
                          {usersIsLoading && !allUsers ? (
                            <div className='flex justify-start items-center animate-pulse'>
                              <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-[122px] h-9'></div>
                              <div className=' bg-gray-300 rounded- allowedUSers dark:bgllowedUSersray-600 w-stringh-10'></div>
                            </div>
                          ) : (
                            allUsers && (
                              <Listbox
                                onChange={(value: IWaspApp[] | []) => handleChangeUserWaspAccess(app.id, value)}
                                multiple
                              >
                                <div className='mt-1'>
                                  <Listbox.Button
                                    id={app.created_at}
                                    className=' w-[122px] relative cursor-pointer rounded-5xl bg-grey-0 py-2 pl-3 pr-9 text-left text-content-primary border'
                                  >
                                    <span
                                      className='block text-xs text-grey-800 w-full h-4 leading-4 truncate ...'
                                      title={
                                        !app.allowed_user_ids || app.allowed_user_ids.length === 0
                                          ? 'none'
                                          : app.allowed_user_ids?.length === app.allowed_user_ids?.length
                                          ? 'All Members'
                                          : allUsers
                                              ?.map((user) =>
                                                app.allowed_user_ids?.includes(user.id) ? user.profile?.name : '',
                                              )
                                              .join(', ')
                                      }
                                    >
                                      {!app.allowed_user_ids || app.allowed_user_ids.length === 0 ? (
                                        'none'
                                      ) : (
                                        <>
                                          {app.allowed_user_ids?.length === 1
                                            ? allUsers.map((user) => (
                                                <Fragment key={`${user.company_id}-${user.id}`}>
                                                  {user.id === app.allowed_user_ids?.[0] && user.profile?.name}
                                                </Fragment>
                                              ))
                                            : app.allowed_user_ids?.length === app.allowed_user_ids?.length
                                            ? 'All Members'
                                            : `${app.allowed_user_ids?.length} Members`}
                                        </>
                                      )}
                                    </span>

                                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                                      <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                    </span>
                                  </Listbox.Button>
                                  <Transition
                                    as={Fragment}
                                    leave='transition ease-in duration-100'
                                    leaveFrom='opacity-100'
                                    leaveTo='opacity-0'
                                  >
                                    <Listbox.Options
                                      className='absolute bottom-0 mt-1 overflow-auto rounded-xs bg-grey-0 py-1 text-content-primary 
                                            z-10 shadow-[0px_10px_20px_0px] shadow-grey-900/60'
                                    >
                                      <div className='flex flex-col max-h-60 custom-scrollbar-thumb gap-2'>
                                        {allUsers.map((user) => (
                                          <Listbox.Option
                                            key={user.id}
                                            className={({active}) =>
                                              `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                                                active || app.allowed_user_ids?.includes(user.id)
                                                  ? 'bg-grey-400/30'
                                                  : 'text-gray-900'
                                              } `
                                            }
                                            value={user}
                                          >
                                            {({selected}) => (
                                              <>
                                                <span className='block truncate ...' title={user.profile?.name}>
                                                  {user.profile?.name??user.email}
                                                </span>
                                                {(selected || app.allowed_user_ids?.includes(user.id)) && (
                                                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-content-primary'>
                                                    <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </div>
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </Listbox>
                            )
                          )}
                        </div>
                        <div className='flex justify-center items-center w-20 pl-1.5'>
                          <CustomSwitch
                            active={app.is_enabled}
                            onChange={(check: boolean) => handleChangeWaspAppActivation(app, check)}
                          />
                        </div>

                        <span
                          className='ml-auto p-1.5 hover:bg-danger-500/10 cursor-pointer transition rounded-full'
                          onClick={() => handleOpenDeleteWaspAppModal(app)}
                        >
                          <TrashIcon width={16} height={16} className='text-grey-900 cursor-pointer' />
                        </span>
                      </div>
                    </>
                  )}
                </Disclosure>
              ))}
        </div>
        {isLoading && !waspApps && (
          <Disclosure>
            {({open}) => (
              <>
                <div className='flex justify-start py-3 items-center animate-pulse'>
                  <div className='h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-52'></div>

                  <div className='w-32 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                  <div className='w-32  h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                  <div className='w-20 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>

                  <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div>
                </div>
              </>
            )}
          </Disclosure>
        )}
      </div>
    </>
  );
}
