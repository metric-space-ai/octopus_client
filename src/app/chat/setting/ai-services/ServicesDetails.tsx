import {useState, useEffect, Fragment} from 'react';
import {Disclosure, Listbox, Transition} from '@headlessui/react';

import {TrashIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon} from '@heroicons/react/24/outline';
import PluginsBadge from './badge';
import CustomSwitch from '@/components/switch/custom-switch';
import {RemovePluginModal} from '@/components/modals/RemovePluginModal';
import {useAuthContext} from '@/contexts/authContext';
import {IAIFunctions, IPlugin, IPluginActivation, IUser} from '@/types';
import CustomCheckbox from '@/components/custom-checkbox';
import {IconButton} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {PLUGINSTATUS} from '@/constant';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {
  deletePluginById,
  deletetAiFunctionsById,
  getAllPlugins,
  putAllowedUsersForAiAccess,
  updatePluginById,
  updatetAiFunctionsById,
} from '@/app/lib/features/aiServices/aiServicesSlice';
import {getAllTeamMembers} from '@/app/lib/features/teamMembers/teamMemberSlice';
import {selectTeamMembers} from '@/app/lib/features/teamMembers/teamMembersSelector';
import { AppDispatch } from '@/app/lib/store';

export default function PluginsDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const {entities: plugins, isLoading, reloadPluginIsAvailable} = useSelector(selectAiServicess);
  const {entities: allUsers, isLoading: usersIsLoading} = useSelector(selectTeamMembers);

  const [removePluginsModal, setRemovePluginsModal] = useState(false);
  const [aiFunctionsLoading, setAiFunctionsLoading] = useState(false);
  const [deleteFunctionsIsLoading, setDeleteFunctionsIsLoading] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<IPlugin>();

  const handleOpenDeletePluginModal = (plugin: IPlugin) => {
    setSelectedPlugin(plugin);
    setRemovePluginsModal(true);
  };

  const handleChangeUserAiAccess = (plugin_id: string, allowedUsers: IUser[]) => {
    console.log({allowedUsers});
    if (allowedUsers.length === 0) {
      dispatch(putAllowedUsersForAiAccess({plugin_id, allowedUsers: []}));
    } else {
      // const result = allowedUsers.reduce((acc,user)=>(acc.push(user.id)),[]:string[])
      const userIds: string[] = allowedUsers.map((user) => user.id);
      // console.log({userIds});
      dispatch(putAllowedUsersForAiAccess({plugin_id, allowedUsers: userIds}));
    }
  };
  const handleConfirmDeletePlugin = async () => {
    if (!selectedPlugin) return;
    dispatch(deletePluginById(selectedPlugin));
  };

  const handleChangePluginActivation = async (plugin_id: string, check: boolean) => {
    if (!plugins) return;

    const payload: IPluginActivation = {operation: check ? 'Enable' : 'Disable', is_enabled: check};
    // const beforeChange = [...plugins];
    // setPlugins([...plugins.flatMap((p) => (p.id === plugin_id ? {...p, is_enabled: check} : p))]);
    dispatch(updatePluginById({plugin_id, payload}));
    // try {
    //   const {status} = await updatePluginByIdApi(plugin_id, payload);
    //   if (status === 201) {
    //     toast.success('updated successfully');
    //   } else {
    //     setPlugins(beforeChange);
    //   }
    // } catch (err) {
    //   setPlugins(beforeChange);
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // } finally {
    // }
  };

  const handleChangeAiFunctionActivation = async (
    index: number,
    funcIndex: number,
    serviceFunction: IAIFunctions,
    check: boolean,
  ) => {
    if (!plugins) return;
    setAiFunctionsLoading(true);
    // const payload = {...serviceFunction, is_enabled: check};
    // const beforeChange = [...plugins];
    // const result = [...plugins];
    // result[index].ai_functions![funcIndex].is_enabled = check;
    // setPlugins(result);
    try {
      dispatch(updatetAiFunctionsById(serviceFunction));
      // const {status} = await updatetAiFunctionsByIdApi(function.ai_service_id, function.id, payload);
      // if (status === 200) {
      //   toast.success('updated successfully');
      // } else {
      //   setPlugins(beforeChange);
      // }
      // } catch (err) {
      //   setPlugins(beforeChange);
      //   if (err instanceof AxiosError) {
      //     toast.error(err?.response?.data.error);
      //   }
    } finally {
      setAiFunctionsLoading(false);
    }
  };

  const handleDeleteServiceAiFunction = async (index: number, service_function: IAIFunctions) => {
    if (!plugins) return;
    setDeleteFunctionsIsLoading(true);
    try {
      dispatch(deletetAiFunctionsById(service_function));
      // const {status} = await deletetAiFunctionsByIdApi(func.ai_service_id, func.id);
      // if (status === 204) {
      //   toast.success('deleted successfully');
      //   getAllPlugins();
      // }
    } finally {
      setDeleteFunctionsIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getAllPlugins());
    dispatch(getAllTeamMembers());
  }, []);

  return (
    <>
      <div className='w-full'>
        <div className='mx-auto custom-scrollbar-thumb'>
          <div className='flex mb-2'>
            <div className='w-52'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Name</span>
            </div>
            <div className='w-28'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Size</span>
            </div>
            <div className='w-[122px]'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>Users</span>
            </div>
            <div className='w-24 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600 '>Status</span>
            </div>
            <div className='w-20 flex justify-center'>
              <span className='font-poppins-medium text-xs leading-5 text-content-grey-600'>On/Off</span>
            </div>
          </div>

          <div className='max-h-[420px] h-full min-w-[570px] overflow-auto'>
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
                        <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                          <div className='flex gap-3 w-52 items-center truncate overflow-hidden'>
                            {plugin.ai_functions && plugin.ai_functions.length > 0 && (
                              <Disclosure.Button className='flex items-center'>
                                <ChevronUpIcon
                                  className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                                />
                              </Disclosure.Button>
                            )}
                            <div className={`flex items-center ${plugin.ai_functions ? '' : 'pl-8'}`}>
                              <p className='text-xs leading-5 text-content-black font-poppins-semibold ml-3'>
                                {plugin.original_file_name}
                              </p>
                            </div>
                          </div>
                          <p className='text-xxs leading-4 w-24 text-content-grey-900 font-poppins-medium'>
                            {/* {plugin.device_map} */}
                          </p>

                          <div className='w-[119px] flex justify-start items-center'>
                            {usersIsLoading ? (
                              <div className='flex justify-start py-3 items-center animate-pulse'>
                                <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-36 h-10'></div>
                                <div className=' bg-gray-300 rounded- allowedUSers dark:bgllowedUSersray-600 w-stringh-10'></div>
                              </div>
                            ) : (
                              allUsers && (
                                <Listbox
                                  //  value={aiAccess}
                                  onChange={(value: IUser[] | []) => handleChangeUserAiAccess(plugin.id, value)}
                                  multiple
                                >
                                  <div className='mt-1'>
                                    <Listbox.Button className=' w-[122px] relative cursor-default rounded-[48px] bg-white py-2 pl-3 pr-10 text-left text-content-primary border'>
                                      <span
                                        className='block text-xs text-content-grey-900 w-[98px] h-4 leading-4 truncate ...'
                                        title={allUsers
                                          ?.map((user) =>
                                            plugin.allowed_user_ids?.includes(user.id) ? user.profile?.name : '',
                                          )
                                          .join(', ')}
                                      >
                                        {!plugin.allowed_user_ids || plugin.allowed_user_ids.length === 0 ? (
                                          'none'
                                        ) : (
                                          <>
                                            {plugin.allowed_user_ids?.length === 1
                                              ? allUsers.map((user) => (
                                                  <Fragment key={`${user.company_id}-${user.id}`}>{user.id === plugin.allowed_user_ids?.[0] && user.profile?.name}</Fragment>
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
                                      <Listbox.Options className='absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-content-primary z-10 shadow-md'>
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
                            className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                            onClick={() => handleOpenDeletePluginModal(plugin)}
                          >
                            <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                          </span>
                        </div>
                        {plugin.ai_functions && (
                          <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 pb-3'>
                            <div className='flex flex-col gap-3 pl-9 w-full'>
                              {plugin.ai_functions.map((func, funcIndex) => (
                                <div key={func.id} className='flex w-full items-center justify-between'>
                                  <CustomCheckbox
                                    active={func.is_enabled}
                                    onChange={(check: boolean) =>
                                      !aiFunctionsLoading
                                        ? handleChangeAiFunctionActivation(index, funcIndex, func, check)
                                        : {}
                                    }
                                    disabled={aiFunctionsLoading}
                                    title={func.description}
                                  />
                                  <IconButton
                                    className='top-4 right-4 mr-5 bg-content-red-600/20 hover:bg-content-red-600/40'
                                    onClick={() => handleDeleteServiceAiFunction(index, func)}
                                  >
                                    {deleteFunctionsIsLoading ? (
                                      <Spinner />
                                    ) : (
                                      <TrashIcon className='w-4 h-4 text-content-primary' />
                                    )}
                                  </IconButton>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        )}
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
          {/* <Disclosure>
            {({open}) => (
              <>
                <div className='flex justify-start py-3 items-center border-t border-content-grey-100'>
                  <div className='flex gap-3 w-52 items-center'>
                    <Disclosure.Button className='flex items-center'>
                      <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
                    </Disclosure.Button>
                    <div className='flex items-center '>
                      <p className='text-xs leading-5 text-content-black font-poppins-semibold ml-3'>Plugin name 1</p>
                    </div>
                  </div>
                  <p className='text-xxs leading-4 w-28 text-content-grey-900 font-poppins-medium'>
                    0.7 / 24GB on GPU2
                  </p>
                  <div className='w-24 text-xs flex justify-center'>
                    <PluginsBadge variant='info' label='Setup' />
                  </div>
                  <div className='flex justify-center items-center w-20'>
                    <Switch
                      checked={active}
                      onChange={(checked) => setActive(checked)}
                      className={classNames(
                        `${
                          active
                            ? 'bg-content-accent shadow-switch-active'
                            : ' shadow-switch-deactive bg-content-grey-100'
                        } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`,
                      )}
                    >
                      {' '}
                      <span className='sr-only'>Use setting</span>
                      <span
                        aria-hidden='true'
                        className={classNames(
                          `${
                            active
                              ? 'translate-x-5 shadow-switch-circle-active bg-content-grey-100'
                              : 'translate-x-0 shadow-switch-circle-deactive bg-white'
                          } pointer-events-none inline-block h-4 w-4 transform rounded-full ring-0 transition duration-200 ease-in-out`,
                        )}
                      />
                    </Switch>
                  </div>

                  <span
                    className='ml-auto p-1.5 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
                    onClick={() => setRemovePluginsModal(true)}
                  >
                    <TrashIcon width={16} height={16} className='text-content-black cursor-pointer' />
                  </span>
                </div>
                <Disclosure.Panel className='pl-5 flex justify-between items-center mt-2 py-3'>
                  <p className='w-full text-xs leading-5 text-content-grey-900 font-poppins-medium ml-3'>
                    Enhance your ChatGPT experience with ImageFlow Connect – a powerful plugin that seamlessly
                    integrates image uploading capabilities into your conversations. With ImageFlow Connect, you can
                    effortlessly share visual context by uploading images directly within the chat interface.
                  </p>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure> */}
        </div>
      </div>
      {selectedPlugin && (
        <RemovePluginModal
          onDelete={handleConfirmDeletePlugin}
          open={removePluginsModal}
          plugin={selectedPlugin}
          onClose={() => {
            setRemovePluginsModal(false);
            setSelectedPlugin(undefined);
          }}
        />
      )}
    </>
  );
}
