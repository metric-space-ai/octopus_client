import React, {Fragment, useEffect, useState} from 'react';

import {Disclosure, Listbox, Transition} from '@headlessui/react';

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {IPlugin, IUser, TWaspAppBgColor} from '@/types';
import classNames from 'classnames';
import PluginsBadge from './badge';
import CustomSwitch from '@/components/switch/custom-switch';
import {PLUGINSTATUS, WASPAPPTEMPLATECOLOR} from '@/constant';
import ServiceFunctions from './ServiceFunctions';

type Props = {
  plugin: IPlugin;
  usersIsLoading: boolean;
  allUsers: IUser[] | null;
  handleChangeUserAiAccess: (plugin_id: string, allowedUsers: IUser[]) => void;
  handleChangePluginActivation: (plugin_id: string, check: boolean) => Promise<void>;
  handleOpenExistedPluginModal: (plugin: IPlugin) => void;
  handleOpenPluginLogsModal: (plugin: IPlugin) => void;
  handleOpenDeletePluginModal: (plugin: IPlugin) => void;
  handleChangeserviceColor: ({id, device_map, color, type}: IPlugin) => Promise<void>;
  changeColorIsLoading: string;
};

const ServiceDetailRow = ({
  plugin,
  usersIsLoading,
  allUsers,
  handleChangeUserAiAccess,
  handleChangePluginActivation,
  handleOpenExistedPluginModal,
  handleOpenPluginLogsModal,
  handleOpenDeletePluginModal,
  handleChangeserviceColor,
  changeColorIsLoading,
}: Props) => {
  const [currentColor, setCurrentColor] = useState<string | null>(plugin.color);
  const [customColor, setCustomColor] = useState(plugin.color);
  const handleChangeCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCustomColor(e.target.value);
  };
  useEffect(() => {
    if (currentColor !== plugin.color && changeColorIsLoading !== plugin.id) {
      console.log('changeColor running', {currentColor, pColor: plugin.color});
      handleChangeserviceColor({...plugin, color: currentColor});
    }
  }, [currentColor]);
  useEffect(() => {
    console.log(customColor);
    if (customColor !== plugin.color && customColor !== currentColor) {
      console.log('change current color ...');
      setCurrentColor(customColor);
    }
  }, [customColor]);

  return (
    <Disclosure key={plugin.id}>
      {({open}) => (
        <Fragment>
          <div className='flex justify-start py-3 items-center border-t border-content-grey-100 gap-1'>
            <div className='flex gap-3 w-52 items-center truncate overflow-hidden'>
              <Disclosure.Button className='flex items-center'>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
              </Disclosure.Button>
              {/* {plugin.status === PLUGINSTATUS.Configuration && (
              <span className='flex h-2 w-2 '>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-content-accent-hover opacity-75'></span>
                <span className='relative inline-flex rounded-full h-1 w-1 bg-content-accent-hover'></span>
              </span>
            )} */}
              <p
                className={classNames('text-xs leading-5 text-content-black font-poppins-semibold truncate ... ')}
                title={plugin.original_file_name}
              >
                {plugin.original_file_name}
              </p>
            </div>

            <div className='w-[122px] flex justify-start items-center'>
              {usersIsLoading && !allUsers ? (
                <div className='flex justify-start items-center animate-pulse'>
                  <div className=' bg-gray-300 rounded-full dark:bg-gray-600 w-[122px] h-8'></div>
                  <div className=' bg-gray-300 rounded- allowedUSers dark:bgllowedUSersray-600 w-stringh-10'></div>
                </div>
              ) : (
                allUsers && (
                  <Listbox onChange={(value: IUser[] | []) => handleChangeUserAiAccess(plugin.id, value)} multiple>
                    <div className='mt-1 relative'>
                      <Listbox.Button className=' w-[122px] relative cursor-default rounded-[48px] bg-white py-2 pl-3 pr-10 text-left text-content-primary border'>
                        <span
                          className='block text-xs text-content-grey-900 w-full h-4 leading-4 truncate ...'
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
                        <Listbox.Options className='absolute bottom-0 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-content-primary z-10 shadow-md'>
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
              <PluginsBadge setupStatus={plugin.setup_status} variant={plugin.status} label={plugin.status} />
            </div>
            <div className='flex justify-center items-center w-20'>
              <CustomSwitch
                disabled={![PLUGINSTATUS.Stopped, PLUGINSTATUS.Running].includes(plugin.status)}
                active={plugin.is_enabled}
                onChange={(check: boolean) => handleChangePluginActivation(plugin.id, check)}
              />
            </div>
            <Listbox
              onChange={(color: TWaspAppBgColor | string) =>
                setCurrentColor(typeof color === 'string' ? color : color.value)
              }
            >
              <div className='mt-1'>
                <Listbox.Button className='relative w-full cursor-default rounded-[48px] bg-white p-2 pr-10 text-left text-content-primary'>
                  <span
                    className='items-center w-4 h-4 rounded-full block'
                    style={{backgroundColor: currentColor ?? WASPAPPTEMPLATECOLOR[0].value}}
                  >
                    {/* {selected.name === 'Public' ? (
                      <UserGroupIcon className='w-4 h-4 text-content-grey-900' />
                    ) : (
                      <LockClosedIcon className='w-4 h-4 text-content-grey-900' />
                    )} */}
                    {/* <span className='text-base text-content-grey-900'>{selected.name}</span> */}
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <ChevronDownIcon className='h-4 w-4 text-gray-400' aria-hidden='true' />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options
                    className='absolute bottom-0 w-full max-w-[256px] rounded-20 bg-white 
                        text-content-primary z-[1] p-1 pr-2 shadow-[0px_10px_20px_0px] shadow-content-black/60'
                  >
                    <div className='flex flex-col max-h-60 custom-scrollbar-thumb gap-2'>
                      {WASPAPPTEMPLATECOLOR.map((color, tabIdx) => (
                        <Listbox.Option
                          key={color.id}
                          className={({active}) =>
                            classNames(
                              `relative select-none py-1 px-4 gap-2 items-center rounded-[40px] text-content-black flex cursor-pointer hover:bg-content-grey-100`,
                              active && 'bg-content-grey-100',
                            )
                          }
                          value={color.value}
                        >
                          <div
                            className='w-7 h-7 rounded-full flex justify-center items-center'
                            style={{backgroundColor: color.value}}
                          >
                            {currentColor === color.value && (
                              <CheckIcon
                                className='h-4 w-4 text-content-grey-900 invert mix-blend-difference'
                                aria-hidden='true'
                              />
                            )}
                          </div>
                          {color.label && <p className='block text-sm leading-normal font-semibold'>{color.label}</p>}
                        </Listbox.Option>
                      ))}
                      <label
                        className={classNames(
                          `relative select-none py-1 px-4 gap-2 items-center rounded-[40px] text-content-black flex cursor-pointer hover:bg-content-grey-100`,
                        )}
                      >
                        <div
                          className='flex w-7 h-7 relative justify-center items-center rounded-full'
                          style={{backgroundColor: customColor ?? ''}}
                        >
                          {currentColor === customColor && (
                            <CheckIcon
                              className='h-4 w-4 text-content-grey-900 invert mix-blend-difference'
                              aria-hidden='true'
                            />
                          )}

                          <input
                            type='color'
                            className='w-0 h-0 opacity-0 '
                            value={customColor ?? ''}
                            onChange={(e) => handleChangeCustomColor(e)}
                          />
                        </div>
                        <p className='block text-sm leading-normal font-semibold'>{customColor ?? 'not Selected'}</p>
                      </label>
                    </div>
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <span
              className='ml-auto p-1 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
              onClick={() => handleOpenExistedPluginModal(plugin)}
            >
              <PencilSquareIcon width={16} height={16} className='text-content-black cursor-pointer' />
            </span>
            <span
              className='ml-auto p-1 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
              onClick={() => handleOpenPluginLogsModal(plugin)}
            >
              <DocumentTextIcon width={16} height={16} className='text-content-black cursor-pointer' />
            </span>
            <span
              className='ml-auto p-1 mr-1 hover:bg-content-red-600/10 cursor-pointer transition rounded-full'
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
  );
};

export default ServiceDetailRow;
