/* eslint-disable react-hooks/exhaustive-deps */
import React, {Fragment, useEffect, useState} from 'react';

import {Listbox, Popover, Transition} from '@headlessui/react';
import {CheckIcon, ChevronDownIcon, ClipboardDocumentIcon, InformationCircleIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {HexColorPicker} from 'react-colorful';
import {useDispatch} from 'react-redux';

import {getAiFunctionsByPluginId} from '@/app/lib/features/aiServices/aiServicesSlice';
import {AppDispatch} from '@/app/lib/store';
import CustomCheckbox from '@/components/custom-checkbox';
import {WASPAPPTEMPLATECOLOR} from '@/constant';
import {bytesCalculator} from '@/helpers';
import {IPlugin, IResources, TWaspAppBgColor} from '@/types';

type Props = {
  setActivatedCPU: React.Dispatch<React.SetStateAction<[] | (string | number)[]>>;
  plugin: IPlugin;
  fileSize?: number;
  resources: IResources | undefined;
  activatedCPU: [] | (string | number)[];
  setPluginType: React.Dispatch<React.SetStateAction<string>>;
  pluginType: string;
  selectedColor: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

const ConfigType = ['Normal', 'System'];
const ConfigurationSection = ({
  setActivatedCPU,
  plugin,
  fileSize,
  resources,
  activatedCPU,
  pluginType,
  setPluginType,
  selectedColor,
  setColor,
}: Props) => {
  const [customColor, setCustomColor] = useState('#ffffff');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleChangeCustomColor = (value: string) => {
    // e.preventDefault();
    // const {value} = e.target;

    setCustomColor(value);
    setColor(value);
  };

  const handleChangeCpuActivation = (check: boolean, cpu_key: string) => {
    if (check) {
      setActivatedCPU((prevValues) => [...prevValues, cpu_key]);
    } else {
      setActivatedCPU((prevValues) => prevValues.filter((val) => val !== cpu_key));
    }
  };

  const getPluginAiFunctions = async () => {
    dispatch(getAiFunctionsByPluginId(plugin.id));
  };
  useEffect(() => {
    if (!plugin.ai_functions) {
      getPluginAiFunctions();
    }
  }, []);

  return (
    <div className='flex flex-col flex-wrap lg:flex-row gap-8 justify-between'>
      <div className='flex flex-col w-5/12'>
        <div className='flex gap-3 mb-6'>
          <span className='w-11 h-11 rounded-full bg-primary-400/10 flex justify-center items-center'>
            <ClipboardDocumentIcon className='text-secondary-700' width={20} height={20} />
          </span>
          <div
            className={classNames(
              'flex flex-col text-left flex-1 truncate',
              fileSize ? 'justify-between' : 'justify-center',
            )}
          >
            <h5
              className='font-semibold text-grey-900 text-sm truncate ...'
              onClick={() => console.log({plugin})}
              title={plugin.original_file_name}
            >
              {plugin.original_file_name}
            </h5>
            {fileSize && <p className='text-grey-600 font-normal text-xs leading-5'>{bytesCalculator(fileSize)}</p>}
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          {/* <p className='text-grey-600 text-xs leading-5 text-left max-w-md'>
            Enhance your ChatGPT experience with ImageFlow Connect - a powerful plugin that seamlessly integrates image
            uploading capabilities into your conversations.
            <br />
            <br />
            With ImageFlow Connect, you can effortlessly share visual context by uploading images directly within the
            chat interface.
          </p> */}
          <p className='text-grey-600 text-xs leading-5 text-left max-w-md max-h-[240px] custom-scrollbar-thumb'>
            {plugin.parser_feedback}
          </p>
        </div>
      </div>

      <div className='flex flex-col w-full lg:w-7/12 max-w-[452px]'>
        <h5 className='text-sm font-semibold text-grey-900 mb-8 text-left'>Assign a plugin to computer resources</h5>

        <div className='flex flex-col gap-3 mb-3 relative'>
          <Listbox value={pluginType} onChange={setPluginType}>
            <div className='relative mt-1'>
              <Listbox.Button className='relative w-full cursor-default rounded-5xl bg-grey-0 py-2 pl-5 pr-10 text-left text-content-primary h-11'>
                <div className='flex gap-1 items-center'>
                  <span className='text-base text-grey-800'>{`Type: ${pluginType}`}</span>
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
                <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-xs bg-grey-0 py-1 text-content-primary z-10'>
                  {ConfigType.map((type) => (
                    <Listbox.Option
                      key={type}
                      className={({active}) =>
                        `relative select-none py-2 pl-10 pr-4 cursor-pointer ${
                          active ? 'bg-grey-100' : 'text-gray-900'
                        }`
                      }
                      value={type}
                    >
                      {({selected}) => (
                        <>
                          <span className='block truncate'>{type}</span>
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
        </div>
        <div className='flex flex-col gap-3 mb-3 relative'>
          <Listbox
            onChange={(color: TWaspAppBgColor | string) => setColor(typeof color === 'string' ? color : color.value)}
          >
            <Listbox.Button className='relative w-full cursor-default rounded-5xl bg-grey-0 py-2 pl-5 pr-10 text-left text-content-primary h-11'>
              <div className='flex gap-1 items-center'>
                <span className='text-base text-grey-800'>{`Color:`}</span>
                <span
                  className='items-center w-1/3 h-5 rounded-2xs block shadow-[0px_10px_20px_0px] shadow-grey-900/5'
                  style={{backgroundColor: selectedColor ?? WASPAPPTEMPLATECOLOR[0].value}}
                />
              </div>

              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </span>
            </Listbox.Button>
            {/* <Listbox.Button className='flex gap-2 w-full items-center cursor-default rounded-5xl bg-grey-0 p-0.5 text-left text-content-primary'>
                <span className='pointer-events-none inset-y-0 flex items-center'>
                  <ChevronDownIcon className='h-4 w-4 text-grey-800' aria-hidden='true' />
                </span>
              </Listbox.Button> */}
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options
                className='absolute top-11 w-full rounded-xl bg-grey-0 
                        text-content-primary z-[1] p-1 pr-2 shadow-[0px_10px_20px_0px] shadow-grey-900/60'
              >
                <div className='flex flex-col max-h-60 custom-scrollbar-thumb gap-2'>
                  {WASPAPPTEMPLATECOLOR.map((color) => (
                    <Listbox.Option
                      key={color.id}
                      className={({active}) =>
                        classNames(
                          `relative select-none py-1 px-4 gap-2 items-center rounded-4xl text-grey-900 flex cursor-pointer hover:bg-grey-100`,
                          active && 'bg-grey-100',
                        )
                      }
                      value={color.value}
                    >
                      <div
                        className='w-7 h-7 rounded-full flex justify-center items-center'
                        style={{backgroundColor: color.value}}
                      >
                        {selectedColor === color.value && (
                          <CheckIcon className='h-4 w-4 text-grey-800 invert mix-blend-difference' aria-hidden='true' />
                        )}
                      </div>
                      {color.label && <p className='block text-sm leading-normal font-semibold'>{color.label}</p>}
                    </Listbox.Option>
                  ))}
                  <label
                    className={classNames(
                      `relative select-none py-1 px-4 gap-2 items-center rounded-4xl text-grey-900 flex cursor-pointer hover:bg-grey-100`,
                    )}
                  >
                    <div>
                      <Popover>
                        {() => (
                          <>
                            <Popover.Button
                              onClick={() => setPopoverOpen(!popoverOpen)}
                              className='flex w-7 h-7 relative justify-center items-center rounded-full'
                              style={{backgroundColor: customColor ?? ''}}
                            >
                              {selectedColor === customColor && (
                                <CheckIcon
                                  className='h-4 w-4 text-grey-800 invert mix-blend-difference'
                                  aria-hidden='true'
                                />
                              )}
                            </Popover.Button>
                            <Transition
                              enter='transition ease-out duration-200'
                              enterFrom='opacity-0 translate-y-1'
                              enterTo='opacity-100 translate-y-0'
                              leave='transition ease-in duration-150'
                              leaveFrom='opacity-100 translate-y-0'
                              leaveTo='opacity-0 translate-y-1'
                            >
                              {popoverOpen && (
                                <Popover.Panel
                                  static
                                  className='absolute left-0 bottom-0 mt-3 transform px-4 sm:px-0 z-50'
                                >
                                  <HexColorPicker color={customColor ?? ''} onChange={handleChangeCustomColor} />
                                </Popover.Panel>
                              )}
                            </Transition>
                          </>
                        )}
                      </Popover>
                      {/* <input
                        type='color'
                        className='w-0 h-0 opacity-0 '
                        value={customColor ?? ''}
                        onChange={(e) => handleChangeCustomColor(e)}
                      /> */}
                    </div>
                    <p className='block text-sm leading-normal font-semibold'>{'Custom'}</p>
                  </label>
                </div>
              </Listbox.Options>
            </Transition>
          </Listbox>
        </div>
        <div className='flex flex-col gap-3 mb-3 max-h-60 relative -mr-4 pr-4 custom-scrollbar-thumb'>
          {resources &&
            Object.entries(resources.device_map).map(([key, value]) =>
              key === 'cpu' ? (
                <div
                  key={`${key}-${value}`}
                  className='w-full flex bg-grey-0 rounded-4xl px-6 py-3 h-45-px items-center'
                >
                  <CustomCheckbox
                    active={activatedCPU.includes(key as never)}
                    onChange={(check: boolean) => handleChangeCpuActivation(check, key)}
                    title={key}
                    description={value}
                  />
                  <span className='text-grey-600 text-xs ml-auto'>{`${resources.memory_used} of ${resources.memory_total}`}</span>
                </div>
              ) : (
                resources.gpus.length > 0 &&
                resources.gpus.map(
                  (gpu) =>
                    gpu.cuda === key && (
                      <div
                        key={`${key}-${value}`}
                        className='w-full flex bg-grey-0 rounded-4xl px-6 py-3 h-45-px items-center'
                      >
                        <CustomCheckbox
                          active={activatedCPU.includes(key as never)}
                          onChange={(check: boolean) => handleChangeCpuActivation(check, key)}
                          title={gpu.name}
                        />
                        <span className='text-grey-600 text-xs ml-auto'>{`${gpu.memory_used} of ${gpu.memory_total}`}</span>
                      </div>
                    ),
                )
              ),
            )}
          {/* {resources &&
          resources.gpus.length > 0 &&
          resources.gpus.map((gpu) => (
            <div
              key={gpu.id}
              className='w-full flex bg-grey-0 rounded-4xl px-6 py-3 h-45-px items-center'
            >
              <CustomCheckbox
                active={activatedGPU.includes(gpu.id)}
                onChange={(check: boolean) => handleChangeGpuActivation(check, gpu.id)}
                title={gpu.name}
                description={gpu.memory_used}
              />
              <span className='text-grey-600 text-xs ml-auto'>{`${resources.memory_free} of ${resources.memory_total}`}</span>
            </div>
          ))} */}
        </div>
      </div>

      {plugin.ai_functions && (
        <div className='flex flex-col w-full gap-3 max-h-[160px] custom-scrollbar-thumb'>
          {plugin.ai_functions?.map((aiFunc) => (
            <div
              key={aiFunc.id}
              className={classNames('flex flex-col gap-2 text-left pl- pt-3 border-t border-grey-400')}
            >
              <div className='flex gap-3 text-xs'>
                {aiFunc.formatted_name}
                <Popover className={'relative flex items-center'}>
                  <Popover.Button>
                    <InformationCircleIcon className='w-4 h-4 text-grey-400 hover:text-grey-900 cursor-pointer transition-colors duration-150' />
                  </Popover.Button>
                  <Popover.Panel
                    className={
                      'bg-grey-800 py-3 px-8 absolute shadow-md shadow-grey-900 rounded-xl w-80 max-w-[80vw] left-4 top-4 z-10'
                    }
                  >
                    <p className='text-grey-0 text-xs font-light'>{aiFunc.generated_description}</p>
                  </Popover.Panel>
                </Popover>
              </div>

              <p className='pl-2 text-xs'>description: {aiFunc.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfigurationSection;
