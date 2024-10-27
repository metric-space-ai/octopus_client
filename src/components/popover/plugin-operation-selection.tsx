/* eslint-disable react-hooks/exhaustive-deps */
import React, {Fragment, useEffect, useMemo, useState} from 'react';

import {Popover, RadioGroup, Transition} from '@headlessui/react';
import {ArrowPathIcon, Cog6ToothIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';

import {getAllPlugins} from '@/app/lib/features/aiServices/aiServicesSlice';
import {selectModels} from '@/app/lib/features/ollamaModels/modelsSelector';
import {getAllModels} from '@/app/lib/features/ollamaModels/modelsSlice';
import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import {getAllWaspApps} from '@/app/lib/features/waspApps/waspAppsSlice';
import {AppDispatch} from '@/app/lib/store';
import {getAiFunctionsByServiceIdApi} from '@/services/settings.service';
import {useChatStore} from '@/store';
import {IAIFunctions, IModel, IPlugin, IWaspApp} from '@/types';

import PopOverDescription from './popOverDescription';
import RadioButtonSelect from '../radio-button-select';

type Props = {
  className: string;
};

enum EOperationSelection {
  Auto = 'Auto',
  Manual = 'Manual',
}

const PluginOperationSelection = ({className}: Props) => {
  const [pluginAutoSelection, setPluginAutoSelection] = useState<EOperationSelection>(EOperationSelection.Auto);
  const [ollamaModelAutoSelection, setOllamaModelAutoSelection] = useState<EOperationSelection>(
    EOperationSelection.Auto,
  );
  const [aiFunctionAutoSelection, setAiFunctionAutoSelection] = useState<EOperationSelection>(EOperationSelection.Auto);
  // const [llmModelsAutoSelection, setLlmModelsAutoSelection] = useState<EOperationSelection>(EOperationSelection.Auto);

  // const [selectedManualWaspApp, setSelectedManualWaspApp] = useState<IWaspApp>();
  // const [selectedManualOllamaModel, setSelectedManualOllamaModel] = useState<IModel>();
  // const [selectedManualAiFunc, setSelectedManualAiFunc] = useState<IAIFunctions>();
  // const [selectedManualLlm, setSelectedManualLlm] = useState<string>();

  // const [llmModels, setLlmModels] = useState<string[]>();
  // const [llmModelsIsLoading, setLlmModelsIsLoading] = useState(false);
  const [aiFunctions, setAiFunctions] = useState<IAIFunctions[]>();
  const [servicesFunctionIsLoading, setServicesFunctionIsLoading] = useState(false);

  const {
    selectedManualWaspApp,
    selectedManualOllamaModel,
    selectedManualAiFunc,
    // selectedManualLlm,
    setSelectedManualWaspApp,
    setSelectedManualOllamaModel,
    setSelectedManualAiFunc,
    // setSelectedManualLlm,
  } = useChatStore();

  const dispatch = useDispatch<AppDispatch>();
  const {entities: waspAppEntities, isLoading: waspEntitiesIsLoading} = useSelector(selectWaspApps);
  const {entities: ollamaModelEntities, ollamaIsLoading} = useSelector(selectModels);

  // const memoizedLlmModels = useMemo(() => {
  //   if (!llmModels) return null;
  //   return llmModels.map((llm) => (
  //     <RadioGroup.Option key={`llm-model-${llm}`} value={llm} className='flex cursor-pointer'>
  //       {({checked}) => (
  //         <div className='flex w-full items-center gap-3'>
  //           <RadioButtonSelect selected={checked} />
  //           <div className='flex items-center gap-1.5'>
  //             <RadioGroup.Label
  //               as='p'
  //               className='font-semibold text-gray-900 text-sm leading-normal truncate max-w-[160px]'
  //             >
  //               {llm}
  //             </RadioGroup.Label>
  //           </div>
  //         </div>
  //       )}
  //     </RadioGroup.Option>
  //   ));
  // }, [llmModels]);

  const memoizedAiFunctions = useMemo(() => {
    if (!aiFunctions) return null;
    return aiFunctions.map((aiFunc) => (
      <RadioGroup.Option key={`ai-fundtion-${aiFunc.id}`} value={aiFunc} className={() => `flex cursor-pointer`}>
        {({checked}) => (
          <>
            <div className='flex w-full items-center gap-3'>
              <RadioButtonSelect selected={checked} />
              <div className='flex items-center gap-1.5'>
                <RadioGroup.Label
                  as='p'
                  className={`font-semibold text-gray-900 text-sm leading-normal truncate ... max-w-[160px]`}
                >
                  {aiFunc.display_name}
                </RadioGroup.Label>
                <RadioGroup.Description as='span' className={``}>
                  <PopOverDescription title={aiFunc.display_name} description={aiFunc.description} />
                </RadioGroup.Description>
              </div>
            </div>
          </>
        )}
      </RadioGroup.Option>
    ));
  }, [aiFunctions]);

  const memoizedOllamaModelEntities = useMemo(() => {
    if (!ollamaModelEntities) return null;
    return ollamaModelEntities.map((model) => (
      <RadioGroup.Option key={`ollama-model-${model.id}`} value={model} className={() => `flex cursor-pointer`}>
        {({checked}) => (
          <>
            <div className='flex w-full items-center gap-3'>
              <RadioButtonSelect selected={checked} />
              <div className='flex items-center gap-1.5'>
                <RadioGroup.Label
                  as='p'
                  className={`font-semibold text-gray-900 text-sm leading-normal truncate ... max-w-[160px]`}
                >
                  {model.name}
                </RadioGroup.Label>
              </div>
            </div>
          </>
        )}
      </RadioGroup.Option>
    ));
  }, [ollamaModelEntities]);

  const handleChangeAiFuncAutoSelection = (value: EOperationSelection, type: 'llm' | 'aiFunc' | 'ollama' | 'wasp') => {
    switch (type) {
      case 'wasp':
        setPluginAutoSelection(value);
        if (value === EOperationSelection.Auto) setSelectedManualWaspApp(undefined);
        break;
      case 'ollama':
        setOllamaModelAutoSelection(value);
        if (value === EOperationSelection.Auto) setSelectedManualOllamaModel(undefined);
        break;
      case 'aiFunc':
        setAiFunctionAutoSelection(value);
        if (value === EOperationSelection.Auto) setSelectedManualAiFunc(undefined);
        break;
      // case 'llm':
      //   setLlmModelsAutoSelection(value);
      //   if (value === EOperationSelection.Auto) setSelectedManualLlm(undefined);
      // break;
      default:
        break;
    }
  };

  const handleChangeSeletedManualAiFunc = (value: IAIFunctions) => {
    setSelectedManualAiFunc(value);
  };
  const handleChangeSeletedManualOllamaModel = (value: IModel) => {
    setSelectedManualOllamaModel(value);
  };
  // const handleChangeSeletedManualLlm = (value: string) => {
  //   setSelectedManualLlm(value);
  // };

  const handleChangeSeletedManualWaspApp = (value: IWaspApp) => {
    setSelectedManualWaspApp(value);
  };

  // const handleGetAllLlmModels = async () => {
  //   setLlmModelsIsLoading(true);
  //   try {
  //     const {status, data: llmModels} = await getllmModelsApi();
  //     if (status === 200) {
  //       const flatAndSortedModels = Object.values(llmModels).flat().sort();
  //       setLlmModels(flatAndSortedModels);
  //     }
  //   } catch (err) {
  //     console.log({err});
  //   } finally {
  //     setLlmModelsIsLoading(false);
  //   }
  // };

  const fetchAiServices = async () => {
    setServicesFunctionIsLoading(true);
    try {
      const {
        meta: {requestStatus},
        payload,
      } = await dispatch(getAllPlugins());
      if (requestStatus === 'fulfilled') {
        const functionRequests = (payload as IPlugin[]).map((service) =>
          getAiFunctionsByServiceIdApi(service.id).then((res) => res.data),
        );

        const allFunctions = await Promise.all(functionRequests);

        setAiFunctions(allFunctions.flat());
      }
    } catch (err) {
      console.log({err});
    } finally {
      setServicesFunctionIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getAllWaspApps());
    dispatch(getAllModels());
    // handleGetAllLlmModels();
    if (!aiFunctions) fetchAiServices();
  }, []);

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
                <div className='flex flex-col rounded-lg p-5 bg-grey-0 shadow-operation-selection gap-2'>
                  <h2 className='font-semibold text-base text-grey-900 mb-2'>Operation Selection</h2>
                  {/* <div className='overflow-hidden'>
                    <h3 className='font-semibold text-sm mb-2 text-grey-900'>llm</h3>
                    <RadioGroup
                      value={llmModelsAutoSelection}
                      onChange={(value) => handleChangeAiFuncAutoSelection(value, 'llm')}
                    >
                      <RadioGroup.Label className='sr-only'>LLM Operation Selection</RadioGroup.Label>
                      <div className='flex flex-col gap-2'>
                        <RadioGroup.Option
                          key='ai-func-Operation-auto'
                          value={EOperationSelection.Auto}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`text-gray-900 font-medium text-sm`}>
                                  {'Auto'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option
                          key='ai-func-Operation-manual'
                          value={EOperationSelection.Manual}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`font-medium text-gray-900 text-sm`}>
                                  {'Manual'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        {llmModelsAutoSelection === EOperationSelection.Manual && (
                          <div className='pl-7 flex flex-col'>
                            {llmModelsIsLoading && (
                              <div className='flex items-center justify-center h-12'>
                                <ArrowPathIcon className='animate-spin w-6 h-6' />
                              </div>
                            )}

                            {!llmModelsIsLoading && (
                              <RadioGroup value={selectedManualLlm} onChange={handleChangeSeletedManualLlm}>
                                <RadioGroup.Label className='sr-only'>LLM Operation Manual Selection</RadioGroup.Label>
                                <div className='flex flex-col gap-2 py-1 max-h-36 custom-scrollbar-thumb'>
                                  {!llmModels || llmModels?.length === 0 ? (
                                    <div className='flex items-center justify-center h-12'>
                                      <h4 className='capitalize text-grey-900'>not found any LLM Model</h4>
                                    </div>
                                  ) : (
                                    // <RadioGroup.Option
                                    //   key={`llm-model-${llm}`}
                                    //   value={llm}
                                    //   className={() => `flex cursor-pointer`}
                                    // >
                                    //   {({checked}) => (
                                    //     <>
                                    //       <div className='flex w-full items-center gap-3'>
                                    //         <RadioButtonSelect selected={checked} />
                                    //         <div className='flex items-center gap-1.5'>
                                    //           <RadioGroup.Label
                                    //             as='p'
                                    //             className={`font-semibold text-gray-900 text-sm leading-normal truncate ... max-w-[160px]`}
                                    //           >
                                    //             {llm}
                                    //           </RadioGroup.Label>
                                    //         </div>
                                    //       </div>
                                    //     </>
                                    //   )}
                                    // </RadioGroup.Option>
                                    memoizedLlmModels
                                  )}
                                </div>
                              </RadioGroup>
                            )}
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div> */}{' '}
                  <div className='overflow-hidden'>
                    <h3 className='font-semibold text-sm mb-2.5 text-grey-900'>Model</h3>
                    <RadioGroup
                      value={ollamaModelAutoSelection}
                      onChange={(value) => handleChangeAiFuncAutoSelection(value, 'ollama')}
                    >
                      <RadioGroup.Label className='sr-only'>Model Operation Selection</RadioGroup.Label>
                      <div className='flex flex-col gap-2'>
                        <RadioGroup.Option
                          key='model-Operation-auto'
                          value={EOperationSelection.Auto}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`text-gray-900 font-medium text-sm`}>
                                  {'Auto'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option
                          key='model-Operation-manual'
                          value={EOperationSelection.Manual}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`font-medium text-gray-900 text-sm`}>
                                  {'Manual'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        {ollamaModelAutoSelection === EOperationSelection.Manual && (
                          <div className='pl-7 flex flex-col'>
                            {ollamaIsLoading && (
                              <div className='flex items-center justify-center h-12'>
                                <ArrowPathIcon className='animate-spin w-6 h-6' />
                              </div>
                            )}

                            {!ollamaIsLoading && (
                              <RadioGroup
                                value={selectedManualOllamaModel}
                                onChange={handleChangeSeletedManualOllamaModel}
                              >
                                <RadioGroup.Label className='sr-only'>
                                  Model Operation Manual Selection
                                </RadioGroup.Label>
                                <div className='flex flex-col gap-2 py-1 max-h-36 custom-scrollbar-thumb'>
                                  {!ollamaModelEntities || ollamaModelEntities?.length === 0 ? (
                                    <div className='flex items-center justify-center h-12'>
                                      <h4 className='capitalize text-grey-900'>not found any Model</h4>
                                    </div>
                                  ) : (
                                    memoizedOllamaModelEntities
                                  )}
                                </div>
                              </RadioGroup>
                            )}
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                  <span className='w-3/4 mx-auto bg-grey-50/90 h-[1px]' />
                  <div className='overflow-hidden'>
                    <h3 className='font-semibold text-sm mb-2.5 text-grey-900'>Ai-Function</h3>
                    <RadioGroup
                      value={aiFunctionAutoSelection}
                      onChange={(value) => handleChangeAiFuncAutoSelection(value, 'aiFunc')}
                    >
                      <RadioGroup.Label className='sr-only'>Ai-Function Operation Selection</RadioGroup.Label>
                      <div className='flex flex-col gap-2'>
                        <RadioGroup.Option
                          key='ai-func-Operation-auto'
                          value={EOperationSelection.Auto}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`text-gray-900 font-medium text-sm`}>
                                  {'Auto'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        <RadioGroup.Option
                          key='ai-func-Operation-manual'
                          value={EOperationSelection.Manual}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`font-medium text-gray-900 text-sm`}>
                                  {'Manual'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        {aiFunctionAutoSelection === EOperationSelection.Manual && (
                          <div className='pl-7 flex flex-col'>
                            {servicesFunctionIsLoading && (
                              <div className='flex items-center justify-center h-12'>
                                <ArrowPathIcon className='animate-spin w-6 h-6' />
                              </div>
                            )}

                            {!servicesFunctionIsLoading && (
                              <RadioGroup value={selectedManualAiFunc} onChange={handleChangeSeletedManualAiFunc}>
                                <RadioGroup.Label className='sr-only'>
                                  Ai-Function Operation Manual Selection
                                </RadioGroup.Label>
                                <div className='flex flex-col gap-2 py-1 max-h-36 custom-scrollbar-thumb'>
                                  {!aiFunctions || aiFunctions?.length === 0 ? (
                                    <div className='flex items-center justify-center h-12'>
                                      <h4 className='capitalize text-grey-900'>not found any Ai-Function</h4>
                                    </div>
                                  ) : (
                                    memoizedAiFunctions
                                  )}
                                </div>
                              </RadioGroup>
                            )}
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                  <span className='w-3/4 mx-auto bg-grey-50/90 h-[1px]' />
                  <div className='overflow-hidden'>
                    <h3 className='font-semibold text-sm mb-2.5 text-grey-900'>Plugin</h3>
                    <RadioGroup
                      value={pluginAutoSelection}
                      onChange={(value) => handleChangeAiFuncAutoSelection(value, 'wasp')}
                    >
                      <RadioGroup.Label className='sr-only'>Plugin Operation Selection</RadioGroup.Label>
                      <div className='flex flex-col gap-2'>
                        <RadioGroup.Option
                          key='Plugin-Operation-auto'
                          value={EOperationSelection.Auto}
                          className={() => `relative flex cursor-pointer`}
                        >
                          {({checked}) => (
                            <>
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`text-gray-900 font-medium text-sm`}>
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
                              <div className='flex w-full items-center gap-1 text-sm'>
                                <RadioButtonSelect selected={checked} />

                                <RadioGroup.Label as='p' className={`font-medium text-gray-900 text-sm`}>
                                  {'Manual'}
                                </RadioGroup.Label>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                        {pluginAutoSelection === EOperationSelection.Manual && (
                          <div className='pl-7 flex flex-col'>
                            {waspEntitiesIsLoading && (
                              <div className='flex items-center justify-center h-12'>
                                <ArrowPathIcon className='animate-spin w-6 h-6' />
                              </div>
                            )}

                            {!waspEntitiesIsLoading && (
                              <RadioGroup value={selectedManualWaspApp} onChange={handleChangeSeletedManualWaspApp}>
                                <RadioGroup.Label className='sr-only'>Plugin Operation Selection</RadioGroup.Label>
                                <div className='flex flex-col gap-2 py-1 max-h-36 custom-scrollbar-thumb'>
                                  {!waspAppEntities || waspAppEntities?.length === 0 ? (
                                    <div className='flex items-center justify-center h-12'>
                                      <h4 className='capitalize text-grey-900'>not found any wasp app</h4>
                                    </div>
                                  ) : (
                                    waspAppEntities?.map((waspApp) => (
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
                                                  <PopOverDescription
                                                    title={waspApp.name}
                                                    description={waspApp.description}
                                                  />
                                                </RadioGroup.Description>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </RadioGroup.Option>
                                    ))
                                  )}
                                </div>
                              </RadioGroup>
                            )}
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
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
