/* eslint-disable react-hooks/exhaustive-deps */
import React, {Fragment, useEffect, useState} from 'react';

import {Popover, RadioGroup, Transition} from '@headlessui/react';
import {ArrowPathIcon, Cog6ToothIcon, InformationCircleIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';

import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import {getAllWaspApps} from '@/app/lib/features/waspApps/waspAppsSlice';
import {AppDispatch} from '@/app/lib/store';
import {IWaspApp} from '@/types';

import RadioButtonSelect from '../radio-button-select';

type Props = {
  className: string;
};

enum EOperationSelection {
  Auto = 'Auto',
  Manual = 'Manual',
}

const PluginOperationSelection = ({className}: Props) => {
  const [autoSelection, setAutoSelection] = useState<EOperationSelection>(EOperationSelection.Auto);
  const [selectedManualWaspApp, setSelectedManualWaspApp] = useState<IWaspApp>();
  const [selectedWaspApp, setSelectedWaspApp] = useState<IWaspApp>();

  const dispatch = useDispatch<AppDispatch>();
  const {entities: waspAppEntities, isLoading: waspEntitiesIsLoading} = useSelector(selectWaspApps);

  const handleOpenDescription = (wasp: IWaspApp) => {
    setSelectedWaspApp(wasp);
  };
  const handleCloseDescription = () => {
    setSelectedWaspApp(undefined);
  };

  const handleChangeSeletedManualWaspApp = (value: IWaspApp) => {
    setSelectedManualWaspApp(value);
    if (selectedWaspApp) handleCloseDescription();
  };

  useEffect(() => {
    dispatch(getAllWaspApps());
  }, []);

  useEffect(() => {
    handleCloseDescription();
  }, [autoSelection]);

  return (
    <div className={className}>
      <Popover className=''>
        {({open}) => (
          <>
            <Popover.Button>
              <Cog6ToothIcon
                className={classNames('w-6 h-6  hover:text-primary', open ? 'text-primary-medium' : 'text-grey-600')}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute -right-10 bottom-16 z-10 mt-3 w-screen max-w-[313px] px-4 sm:px-0'>
                <div className='overflow-hidden rounded-lg shadow-operation-selection p-5 bg-grey-0 '>
                  <h3 className='font-semibold text-lg mb-4.5 text-grey-900'>Plugin Operation Selection</h3>
                  <RadioGroup value={autoSelection} onChange={setAutoSelection}>
                    <RadioGroup.Label className='sr-only'>Plugin Operation Selection</RadioGroup.Label>
                    <div className='flex flex-col gap-2'>
                      <RadioGroup.Option
                        key='Plugin-Operation-auto'
                        value={EOperationSelection.Auto}
                        className={() => `relative flex cursor-pointer`}
                      >
                        {({checked}) => (
                          <>
                            <div className='flex w-full items-center gap-1'>
                              <RadioButtonSelect selected={checked} />

                              <RadioGroup.Label as='p' className={`text-gray-900 font-medium`}>
                                {'Auto'}
                              </RadioGroup.Label>
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        key='Plugin-Operation-manual'
                        value={EOperationSelection.Manual}
                        className={() => `relative flex cursor-pointer`}
                      >
                        {({checked}) => (
                          <>
                            <div className='flex w-full items-center gap-1'>
                              <RadioButtonSelect selected={checked} />

                              <RadioGroup.Label as='p' className={`font-medium text-gray-900`}>
                                {'Manual'}
                              </RadioGroup.Label>
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                      {autoSelection === EOperationSelection.Manual && (
                        <div className='pl-7 flex flex-col'>
                          {waspEntitiesIsLoading && (
                            <div className='flex items-center justify-center h-12'>
                              <ArrowPathIcon className='animate-spin w-6 h-6' />
                            </div>
                          )}
                          {!waspEntitiesIsLoading && (!waspAppEntities || waspAppEntities?.length === 0) && (
                            <div className='flex items-center justify-center h-12'>
                              <h4 className='capitalize text-grey-900'>nothing found</h4>
                            </div>
                          )}
                          {!waspEntitiesIsLoading && waspAppEntities?.length && (
                            <RadioGroup value={selectedManualWaspApp} onChange={handleChangeSeletedManualWaspApp}>
                              <RadioGroup.Label className='sr-only'>Plugin Operation Selection</RadioGroup.Label>
                              <div className='flex flex-col gap-2 py-1'>
                                {waspAppEntities?.map((waspApp) => (
                                  <RadioGroup.Option
                                    key={waspApp.id}
                                    value={waspApp}
                                    className={() => `flex cursor-pointer`}
                                  >
                                    {({checked}) => (
                                      <>
                                        <div className='flex w-full items-center gap-3'>
                                          <RadioButtonSelect selected={checked} />
                                          <div className='flex items-center gap-1.5'>
                                            <RadioGroup.Label
                                              as='p'
                                              className={`font-semibold text-gray-900 text-sm leading-normal truncate ... max-w-[160px]`}
                                            >
                                              {waspApp.name}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description as='span' className={``}>
                                              <InformationCircleIcon
                                                className='w-4 h-4 text-grey-900 hover:text-primary cursor-pointer'
                                                onClick={() => handleOpenDescription(waspApp)}
                                              />
                                            </RadioGroup.Description>
                                          </div>
                                        </div>
                                        {selectedWaspApp && selectedWaspApp.id === waspApp.id && (
                                          <div
                                            className={classNames(
                                              'shadow-operation-selection pl-5 pr-6 py-4 bg-grey-0 absolute -right-10 flex flex-col bg-white z-20 w-[540px] rounded-xl max-h-[98px] custom-scrollbar-thumb',
                                              selectedWaspApp.id && 'block',
                                              !selectedWaspApp && 'hidden',
                                            )}
                                          >
                                            {/* <h5 className='text-base mb-2'>{selectedWaspApp.name}</h5> */}
                                            <p className='text-grey-900 text-sm font-normal'>
                                              {selectedWaspApp.description}
                                            </p>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default PluginOperationSelection;
