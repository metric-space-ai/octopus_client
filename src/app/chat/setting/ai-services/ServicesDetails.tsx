import {useEffect, Fragment} from 'react';
import {Disclosure, Listbox, Transition} from '@headlessui/react';

import {
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  PencilSquareIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import PluginsBadge from './badge';
import CustomSwitch from '@/components/switch/custom-switch';
import {IPlugin, IPluginActivation, IUser} from '@/types';
import {PLUGINSTATUS} from '@/constant';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {
  getAllPlugins,
  putAllowedUsersForAiAccess,
  changePluginActivitiesByPluginId,
  handleChangeSelectedPlugin,
  handleChangeOpenPluginLogsDialog,
  handleChangeOpenRemovePluginDialog,
} from '@/app/lib/features/aiServices/aiServicesSlice';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import {AppDispatch} from '@/app/lib/store';
import ServiceFunctions from './ServiceFunctions';
import classNames from 'classnames';

type Props = {
  handleOpenExistedPluginModal: (plugin: IPlugin) => void;
  handleOpenPluginLogsModal: (plugin: IPlugin) => void;
};

export default function AiServicesDetails({handleOpenExistedPluginModal, handleOpenPluginLogsModal}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: plugins, isLoading, reloadPluginIsAvailable} = useSelector(selectAiServicess);

  const {entities: allUsers, isLoading: usersIsLoading} = useSelector(selectTeamMembers);

  const handleOpenEditPluginDialog = (plugin: IPlugin) => {
    dispatch(handleChangeOpenPluginLogsDialog(true));
    dispatch(handleChangeSelectedPlugin(plugin));
  };
  const handleOpenDeletePluginModal = (plugin: IPlugin) => {
    dispatch(handleChangeSelectedPlugin(plugin));
    dispatch(handleChangeOpenRemovePluginDialog(true));
  };

  const handleChangeUserAiAccess = (plugin_id: string, allowedUsers: IUser[]) => {
    if (allowedUsers.length === 0) {
      dispatch(putAllowedUsersForAiAccess({plugin_id, allowedUsers: []}));
    } else {
      const userIds: string[] = allowedUsers.map((user) => user.id);

      dispatch(putAllowedUsersForAiAccess({plugin_id, allowedUsers: userIds}));
    }
  };

  const handleChangePluginActivation = async (plugin_id: string, check: boolean) => {
    if (!plugins) return;

    const payload: IPluginActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
    dispatch(changePluginActivitiesByPluginId({plugin_id, payload}));
  };

  useEffect(() => {
    dispatch(getAllPlugins());
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto custom-scrollbar-thumb'>
          <div className='flex mb-2 gap-1'>
            <div className='w-52'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>sss Name</span>
            </div>
            {/* <div className='w-28'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Size</span>
            </div> */}
            <div className='w-[122px] text-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Users</span>
            </div>
            <div className='w-28 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>Status</span>
            </div>
            <div className='w-20 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>On/Off</span>
            </div>
          </div>

          <div className='h-[280px] min-w-[570px] custom-scrollbar-thumb'>
            {reloadPluginIsAvailable && (
              <div className='w-full'>
                <h2
                  className='uppercase text-content-accent cursor-pointer text-center py-6 hover:underline'
                  onClick={() => getAllPlugins()}
                >
                  try again
                </h2>
              </div>
            )}
            {!plugins || plugins.length === 0
              ? !isLoading && (
                  <div className='flex justify-center py-3 items-center border-t border-content-grey-100'>
                    <h2 className='text-lg text-content-accent uppercase'>not found</h2>
                  </div>
                )
              : plugins.map((plugin, index) => (
                  <Disclosure key={plugin.id}>
                    {({open}) => (
                      <Fragment>
                        <div className='flex justify-start py-3 items-center border-t border-content-grey-100 gap-1'>
                          <div className='flex gap-3 w-52 items-center truncate overflow-hidden'>
                            <Disclosure.Button className='flex items-center'>
                              <ChevronUpIcon
                                className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                              />
                            </Disclosure.Button>
                            {/* {plugin.status === PLUGINSTATUS.Configuration && (
                              <span className='flex h-2 w-2 '>
                                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-content-accent-hover opacity-75'></span>
                                <span className='relative inline-flex rounded-full h-1 w-1 bg-content-accent-hover'></span>
                              </span>
                            )} */}
                            <p
                              className={classNames(
                                'text-xs leading-5 text-content-black font-poppins-semibold truncate ... ',
                              )}
                              title={plugin.original_file_name}
                            >
                              {plugin.original_file_name}
                            </p>
                          </div>
                          {/* <p className='text-xxs leading-4 w-24 text-content-grey-900 font-poppins-medium'>
                            
                          </p> */}

                          <div className='w-[122px] flex justify-start items-center'>
                            {usersIsLoading && !allUsers ? (
                              <div className='flex justify-start items-center animate-pulse'>
                                <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-[122px] h-8'></div>
                                <div className=' bg-gray-300 rounded- allowedUSers dark:bgllowedUSersray-600 w-stringh-10'></div>
                              </div>
                            ) : (
                              allUsers && (
                                <Listbox
                                  onChange={(value: IUser[] | []) => handleChangeUserAiAccess(plugin.id, value)}
                                  multiple
                                >
                                  <div className='mt-1 relative'>
                                    <Listbox.Button className=' w-[122px] relative cursor-default rounded-[48px] bg-white py-2 pl-3 pr-10 text-left text-content-primary border'>
                                      <span
                                        className='block text-xs text-content-grey-900 w-[98px] h-4 leading-4 truncate ...'
                                        title={
                                          !plugin.allowed_user_ids || plugin.allowed_user_ids.length === 0
                                            ? 'none'
                                            : allUsers
                                                ?.map((user) =>
                                                  plugin.allowed_user_ids?.includes(user.id) ? user.profile?.name : '',
                                                )
                                                .join(', ')
                                        }
                                      >
                                        {!plugin.allowed_user_ids || plugin.allowed_user_ids.length === 0 ? (
                                          'none'
                                        ) : (
                                          <>
                                            {plugin.allowed_user_ids?.length === 1
                                              ? allUsers.map((user) => (
                                                  <Fragment key={`${user.company_id}-${user.id}`}>
                                                    {user.id === plugin.allowed_user_ids?.[0] && user.profile?.name}
                                                  </Fragment>
                                                ))
                                              : plugin.allowed_user_ids?.length === plugin.allowed_user_ids?.length
                                              ? 'All Members'
                                              : `${plugin.allowed_user_ids?.length} Members`}
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
                                      <Listbox.Options className='absolute top-0 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-content-primary z-10 shadow-md'>
                                        {allUsers.map((user) => (
                                          <Listbox.Option
                                            key={user.id}
                                            className={({active}) =>
                                              `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                                                active || plugin.allowed_user_ids?.includes(user.id)
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
                                                {(selected || plugin.allowed_user_ids?.includes(user.id)) && (
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

                          <div className='w-28 text-xs flex justify-center items-center gap-1'>
                            <PluginsBadge
                              setupStatus={plugin.setup_status}
                              variant={plugin.status}
                              label={plugin.status}
                            />
                          </div>
                          <div className='flex justify-center items-center w-20'>
                            <CustomSwitch
                              disabled={![PLUGINSTATUS.Stopped, PLUGINSTATUS.Running].includes(plugin.status)}
                              active={plugin.is_enabled}
                              onChange={(check: boolean) => handleChangePluginActivation(plugin.id, check)}
                            />
                          </div>

                          <span
                            className='ml-auto p-1.5 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenExistedPluginModal(plugin)}
                          >
                            <PencilSquareIcon width={16} height={16} className='text-content-black cursor-pointer' />
                          </span>
                          <span
                            className='ml-auto p-1.5 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenPluginLogsModal(plugin)}
                          >
                            <DocumentTextIcon width={16} height={16} className='text-content-black cursor-pointer' />
                          </span>
                          <span
                            className='ml-auto p-1.5 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenDeletePluginModal(plugin)}
                          >
                            <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                          </span>
                        </div>
                        <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 pb-3'>
                          <ServiceFunctions serviceId={plugin.id} ai_functions={plugin.ai_functions} />
                        </Disclosure.Panel>
                      </Fragment>
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

                    <div className='w-24 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    <div className='w-24  h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>
                    <div className='w-16 mx-2 h-5 bg-gray-300 rounded-full dark:bg-gray-600'></div>

                    <div className='ml-auto h-5 bg-gray-300 rounded-full dark:bg-gray-600 w-5 mx-1.5'></div>
                  </div>
                </>
              )}
            </Disclosure>
          )}
        </div>
      </div>
    </>
  );
}
