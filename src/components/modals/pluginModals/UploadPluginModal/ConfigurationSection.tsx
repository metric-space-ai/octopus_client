import React, {Fragment, useState} from 'react';
import CustomCheckbox from '@/components/custom-checkbox';
import {CheckIcon, ChevronDownIcon, ClipboardDocumentIcon} from '@heroicons/react/24/outline';
import {bytesCalculator} from '@/helpers';
import {IResources} from '@/types';
import classNames from 'classnames';
import {Listbox, Transition} from '@headlessui/react';

type Props = {
  setActivatedCPU: React.Dispatch<React.SetStateAction<[] | (string | number)[]>>;
  file_name: string;
  fileSize?: number;
  resources: IResources | undefined;
  activatedCPU: [] | (string | number)[];
  setPluginType: React.Dispatch<React.SetStateAction<string>>;
  pluginType: string;
};

const ConfigType = ['Normal', 'System'];
const ConfigurationSection = ({
  setActivatedCPU,
  file_name,
  fileSize,
  resources,
  activatedCPU,
  pluginType,
  setPluginType,
}: Props) => {
  const handleChangeCpuActivation = (check: boolean, cpu_key: string) => {
    if (check) {
      setActivatedCPU((prevValues) => [...prevValues, cpu_key]);
    } else {
      setActivatedCPU((prevValues) => prevValues.filter((val) => val !== cpu_key));
    }
  };

  return (
    <div className='flex flex-col lg:flex-row gap-8 justify-between'>
      <div className='flex flex-col w-5/12'>
        <div className='flex gap-3 mb-6'>
          <span className='w-11 h-11 rounded-full bg-content-accent-light-11 flex justify-center items-center'>
            <ClipboardDocumentIcon className='text-content-blue-dark' width={20} height={20} />
          </span>
          <div
            className={classNames(
              'flex flex-col text-left flex-1 truncate',
              fileSize ? 'justify-between' : 'justify-center',
            )}
          >
            <h5 className='font-poppins-semibold text-content-black text-sm truncate ...' title={file_name}>
              {file_name}
            </h5>
            {fileSize && (
              <p className='text-content-grey-600 font-normal text-xs leading-5'>{bytesCalculator(fileSize)}</p>
            )}
          </div>
        </div>
        <div className='flex'>
          <p className='text-content-grey-600 text-xs leading-5 text-left max-w-md'>
            Enhance your ChatGPT experience with ImageFlow Connect - a powerful plugin that seamlessly integrates image
            uploading capabilities into your conversations.
            <br />
            <br />
            With ImageFlow Connect, you can effortlessly share visual context by uploading images directly within the
            chat interface.
          </p>
        </div>
      </div>

      <div className='flex flex-col w-full lg:w-7/12 max-w-[452px]'>
        <h5 className='text-sm font-poppins-semibold text-content-black mb-8 text-left'>
          Assign a plugin to computer resources
        </h5>

        <div className='flex flex-col gap-3 mb-3 relative mr-3'>
          <Listbox value={pluginType} onChange={setPluginType}>
            <div className='relative mt-1'>
              <Listbox.Button className='relative w-full cursor-default rounded-[48px] bg-white py-2 pl-5 pr-10 text-left text-content-primary'>
                <div className='flex gap-1 items-center'>
                  <span className='text-base text-content-grey-900'>{`Type: ${pluginType}`}</span>
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
                <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-content-primary z-10'>
                  {ConfigType.map((type) => (
                    <Listbox.Option
                      key={type}
                      className={({active}) =>
                        `relative select-none py-2 pl-10 pr-4 ${active ? 'bg-content-grey-100' : 'text-gray-900'}`
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
        <div className='flex flex-col gap-3 mb-3 max-h-60 relative -mr-4 pr-4 custom-scrollbar-thumb'>
          {resources &&
            Object.entries(resources.device_map).map(([key, value]) =>
              key === 'cpu' ? (
                <div
                  key={`${key}-${value}`}
                  className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'
                >
                  <CustomCheckbox
                    active={activatedCPU.includes(key as never)}
                    onChange={(check: boolean) => handleChangeCpuActivation(check, key)}
                    title={key}
                    description={value}
                  />
                  <span className='text-content-grey-600 text-xs ml-auto'>{`${resources.memory_used} of ${resources.memory_total}`}</span>
                </div>
              ) : (
                resources.gpus.length > 0 &&
                resources.gpus.map(
                  (gpu) =>
                    gpu.cuda === key && (
                      <div
                        key={`${key}-${value}`}
                        className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'
                      >
                        <CustomCheckbox
                          active={activatedCPU.includes(key as never)}
                          onChange={(check: boolean) => handleChangeCpuActivation(check, key)}
                          title={gpu.name}
                        />
                        <span className='text-content-grey-600 text-xs ml-auto'>{`${resources.memory_used} of ${resources.memory_total}`}</span>
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
              className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'
            >
              <CustomCheckbox
                active={activatedGPU.includes(gpu.id)}
                onChange={(check: boolean) => handleChangeGpuActivation(check, gpu.id)}
                title={gpu.name}
                description={gpu.memory_used}
              />
              <span className='text-content-grey-600 text-xs ml-auto'>{`${resources.memory_free} of ${resources.memory_total}`}</span>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSection;
