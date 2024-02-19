import {useState, useEffect, Fragment} from 'react';
import {Disclosure, Listbox, Transition} from '@headlessui/react';

import {TrashIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon} from '@heroicons/react/24/outline';
import CustomSwitch from '@/components/switch/custom-switch';
import {IWaspApp} from '@/types';
import {useSelector, useDispatch} from 'react-redux';
import {getAllWaspApps, deleteWaspAppById, updateWaspApp} from '@/app/lib/features/waspApps/waspAppsSlice';

import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import Highlight from 'react-highlight';

import './../../../../assets/atelier-cave-dark.css';
import RemoveWaspAppModal from '@/components/modals/RemoveWaspAppModal';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {AppDispatch} from '@/app/lib/store';

export default function WaspAppsDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: waspApps, isLoading, reloadWaspAppIsAvailable} = useSelector(selectWaspApps);
  const {entities: allUsers, isLoading: usersIsLoading} = useSelector(selectTeamMembers);

  const [openRemoveWaspAppsModal, setOpenRemoveWaspAppsModal] = useState(false);
  const [selectedWaspApp, setSelectedWaspApp] = useState<IWaspApp>();

  const handleOpenDeleteWaspAppModal = (waspApp: IWaspApp) => {
    setSelectedWaspApp(waspApp);
    setOpenRemoveWaspAppsModal(true);
  };

  const handleConfirmDeleteWaspApp = async () => {
    if (!selectedWaspApp) return;
    dispatch(deleteWaspAppById(selectedWaspApp.id));
  };

  const handleChangeWaspAppActivation = async (app: IWaspApp, check: boolean) => {
    if (!waspApps) return;
    const payload: IWaspApp = {...app, is_enabled: check};
    dispatch(updateWaspApp(payload));
    // const payload: IWaspAppActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
    // const beforeChange = [...waspApps];
    // setWaspApps([...waspApps.flatMap((p) => (p.id === app_id ? {...p, is_enabled: check} : p))]);
    // dispatch(deleteWaspAppById({app_id, payload}));
    // try {
    //   const {status} = await updateWaspAppByIdApi(app_id, payload);
    //   if (status === 201) {
    //     toast.success('updated successfully');
    //   } else {
    //     setWaspApps(beforeChange);
    //   }
    // } catch (err) {
    //   setWaspApps(beforeChange);
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // } finally {
    // }
  };

  const handleChangeUserWaspAccess = (wasp_id: string, allowedUsers: IWaspApp[]) => {
    
    if (allowedUsers.length === 0) {
      // dispatch(putAllowedUsersForAiAccess({wasp_id, allowedUsers: []}));
    } else {
      // const result = allowedUsers.reduce((acc,user)=>(acc.push(user.id)),[]:string[])
      const userIds: string[] = allowedUsers.map((user) => user.id);
      // console.log({userIds});
      // dispatch(putAllowedUsersForAiAccess({wasp_id, allowedUsers: userIds}));
    }
  };

  useEffect(() => {
    dispatch(getAllWaspApps());
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto custom-scrollbar-thumb'>
          <div className='flex mb-2'>
            <div className='w-[150px]'>
              <span
                className='font-poppins-medium text-xs leading-5 text-content-grey-600'
                onClick={() => console.log({waspApps})}
              >
                Name
              </span>
            </div>
            <div className='w-28'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>Description</span>
            </div>
            <div className='w-28'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>Formatted name</span>
            </div>
            <div className='w-32'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>Users</span>
            </div>
            <div className='w-20 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>On/Off</span>
            </div>
          </div>

          <div className='max-h-[280px] h-full min-w-[570px] overflow-auto custom-scrollbar-thumb'>
            {reloadWaspAppIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-content-accent cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllWaspApps()}
                >
                  try again
                </h2>
              </div>
            )}
            {!waspApps || waspApps.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                    <h2 className='text-lg text-content-accent uppercase'>not found</h2>
                  </div>
                )
              : waspApps.map((app, index) => (
                  <Disclosure key={app.id}>
                    {({open}) => (
                      <>
                        <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                          <div className='flex gap-3 w-[150px] items-center'>
                            <div className={`flex items-center flex-1`}>
                              <p
                                className='text-xs leading-5 h-5 text-content-black font-poppins-semibold w-36 truncate ...'
                                title={app.name}
                              >
                                {app.name}
                              </p>
                            </div>
                          </div>

                          <div className='flex w-28 pr-1.5'>
                            <p
                              className='text-xxs  leading-4 h-4 text-content-grey-900 font-poppins-medium truncate ...'
                              title={app.description}
                            >
                              {app.description}
                            </p>
                          </div>

                          <div className='flex w-28 pr-1.5'>
                            <p
                              className='text-xxs  leading-4 h-4 text-content-grey-900 font-poppins-medium truncate ...'
                              title={app.formatted_name}
                            >
                              {app.formatted_name}
                            </p>
                          </div>

                          <div className='w-32 flex justify-start items-center'>
                            {usersIsLoading ? (
                              <div className='flex justify-start py-3 items-center animate-pulse'>
                                <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-[122px] h-9'></div>
                                <div className=' bg-gray-300 rounded- allowedUSers dark:bgllowedUSersray-600 w-stringh-10'></div>
                              </div>
                            ) : (
                              allUsers && (
                                <Listbox
                                  onChange={(value: IWaspApp[] | []) => handleChangeUserWaspAccess(app.id, value)}
                                  multiple
                                >
                                  <div className='mt-1 relative'>
                                    <Listbox.Button className=' w-[122px] relative cursor-pointer rounded-[48px] bg-white py-2 pl-3 pr-10 text-left text-content-primary border'>
                                      <span
                                        className='block text-xs text-content-grey-900 w-[98px] h-4 leading-4 truncate ...'
                                        title={
                                          !app.allowed_user_ids || app.allowed_user_ids.length === 0
                                            ? 'none'
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
                                      <Listbox.Options className='absolute top-8 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-content-primary z-10 shadow-md'>
                                        {allUsers.map((user) => (
                                          <Listbox.Option
                                            key={user.id}
                                            className={({active}) =>
                                              `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                                                active || app.allowed_user_ids?.includes(user.id)
                                                  ? 'bg-content-grey-400/30'
                                                  : 'text-gray-900'
                                              } `
                                            }
                                            value={user}
                                          >
                                            {({selected}) => (
                                              <>
                                                <span className='block truncate' title={user.profile?.name}>
                                                  {user.profile?.name}
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
                            className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenDeleteWaspAppModal(app)}
                          >
                            <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                          </span>
                        </div>
                      </>
                    )}
                  </Disclosure>
                ))}
          </div>
          {isLoading && (
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
      </div>
      {selectedWaspApp && (
        <RemoveWaspAppModal
          onDelete={handleConfirmDeleteWaspApp}
          open={openRemoveWaspAppsModal}
          waspApp={selectedWaspApp}
          onClose={() => {
            setOpenRemoveWaspAppsModal(false);
            setSelectedWaspApp(undefined);
          }}
        />
      )}
    </>
  );
}
