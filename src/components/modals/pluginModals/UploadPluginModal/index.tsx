import React, {ChangeEvent, DragEvent, Fragment, useEffect, useRef, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CodeBracketIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {AxiosError} from 'axios';
import classNames from 'classnames';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';

import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {getAllPlugins, handleChangeSelectedPlugin} from '@/app/lib/features/aiServices/aiServicesSlice';
import {AppDispatch} from '@/app/lib/store';
import CustomCheckbox from '@/components/custom-checkbox';
import {PLUGINSTATUS} from '@/constant';
import {bytesCalculator, downloadAs} from '@/helpers';
import {
  addPluginConfigurationApi,
  downloadOriginalFunctionBodyApi,
  downloadProcessedFunctionBodyApi,
  getPluginByIdApi,
  getServerResourcesApi,
  startPluginInstallationApi,
  updatePluginByIdApi,
  uploadNewPluginApi,
} from '@/services/settings.service';
import {IDeviceMap, IResources} from '@/types';

import ConfigurationSection from './ConfigurationSection';
import InstallationPluginSection from './InstallationPluginSection';
import InstallationStartedSection from './InstallationStartedSection';
import UploadPluginModalHeaderSection from './UploadPluginModalHeaderSection';
import {Button, IconButton} from '../../../buttons';

// const VALIDPLUGINFILE = {Format: '.py', Type: 'text/x-python'};
const ADDPLUGINSTEPS = {Upload: 1, Setup: 2, PreparingForInstall: 3, Installation: 4};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const UploadPluginModal = ({open, onClose}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {selectedPlugin} = useSelector(selectAiServicess);

  const [code, setCode] = useState(``);
  const [updateWithTextEditor, setUpdateWithTextEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File>();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(ADDPLUGINSTEPS.Upload);

  const [resources, setResources] = useState<IResources>();

  const [installStarted, setInstallStarted] = useState(false);
  const [installPercentage, setInstallPercentage] = useState(0);
  const [pluginInstalled, setPluginInstalled] = useState(false);
  const [activatedCPU, setActivatedCPU] = useState<(keyof IDeviceMap)[] | []>([]);
  const [pluginType, setPluginType] = useState('Normal');
  const [bypassCodeCheck, setBypassCodeCheck] = useState(true);
  const [color, setColor] = useState('');

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSubmitSecondStep = async () => {
    if (selectedPlugin && currentStep === ADDPLUGINSTEPS.Setup) {
      setLoading(true);
      if (!selectedPlugin || !resources) return;
      const device_map = Object.entries(resources.device_map).reduce((acc: IDeviceMap, [key, value]) => {
        if (activatedCPU.includes(key as never)) {
          acc[key] = value;
        }
        return acc;
      }, {});
      // const gpus = resources.gpus.filter((gpu) => activatedGPU.includes(gpu.id));

      try {
        const {status, data} = await addPluginConfigurationApi({
          id: selectedPlugin.id,
          device_map,
          type: pluginType === 'Normal' ? 'Normal' : 'System',
          color,
        });
        if (status === 200) {
          dispatch(handleChangeSelectedPlugin(data));
          setCurrentStep(ADDPLUGINSTEPS.PreparingForInstall);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitFirstStep = async () => {
    setLoading(true);

    if (currentStep !== ADDPLUGINSTEPS.Upload) return;

    const formData = new FormData();
    formData.append('bypass_code_check', `${bypassCodeCheck}`);
    if (selectedPlugin) {
      if (updateWithTextEditor) {
        const blob = new Blob([code], {type: 'text/plain'});
        formData.append('file', blob, selectedPlugin.original_file_name);
      } else if (file) {
        const newFile = new File([file], selectedPlugin.original_file_name, {type: 'application/octet-stream'});
        formData.append('file', newFile);
      }

      // dispatch(updatePluginById({id: selectedPlugin.id, formData}));
      try {
        const {status, data} = await updatePluginByIdApi(selectedPlugin.id, formData);
        if (status === 200) {
          toast.success('code updated');
          setCurrentStep(ADDPLUGINSTEPS.Setup);
          // handleCloseModal();
        }
        return data;
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
        }
      } finally {
        setLoading(false);
      }
    } else if (fileUploaded && file) {
      const newFile = new File([file], file.name, {type: 'application/octet-stream'});
      formData.append('file', newFile);
      try {
        const {status, data} = await uploadNewPluginApi(formData);
        if (status === 201) {
          dispatch(handleChangeSelectedPlugin(data));
          setCurrentStep(ADDPLUGINSTEPS.Setup);
          toast.success('upload successfull');
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDragFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // handleCheckFileIsValid(e.dataTransfer.files[0]);
    setFile(e.dataTransfer.files[0]);
  };
  const handleCustomSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      setFile(e.target.files[0]);
      // handleCheckFileIsValid(e.target.files[0]);
    }
  };

  const getResources = async () => {
    try {
      const {status, data} = await getServerResourcesApi();
      if (status === 200) {
        setResources(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteFile = () => {
    setFile(undefined);
  };
  // const handleCheckFileIsValid = (file: File) => {
  //   if (file.name.includes(VALIDPLUGINFILE.Format) && file.type.includes(VALIDPLUGINFILE.Type)) {
  //     setFile(file);
  //   } else {
  //     toast.error(
  //       `An incorrect file has been selected for the selected file. format:${file.name} _ type:${file.type} The expected format is "*.py" and valid type is "text/x-python"`,
  //     );
  //   }
  // };

  const handleCloseModal = () => {
    setUploadStarted(false);
    setUploadPercentage(0);
    setFile(undefined);
    setFileIsSelected(false);
    setFileUploaded(false);
    setCurrentStep(ADDPLUGINSTEPS.Upload);
    setInstallStarted(false);
    setInstallPercentage(0);
    setPluginInstalled(false);
    setLoading(false);
    dispatch(handleChangeSelectedPlugin(null));
    setUpdateWithTextEditor(false);
    setCode('');
    dispatch(getAllPlugins());
    onClose();
  };

  const handleGetInstallationProgress = async () => {
    if (!selectedPlugin) return;
    try {
      const {status, data} = await getPluginByIdApi(selectedPlugin.id);
      if (status === 200) {
        dispatch(handleChangeSelectedPlugin(data));
        if (data.progress) {
          setInstallPercentage(data.progress);
        }
        if (data.progress === 100) {
          setPluginInstalled(true);
          setInstallStarted(false);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  };

  const handleStartInstallationApi = async () => {
    if (!selectedPlugin) return;
    setLoading(true);
    try {
      const {status, data} = await startPluginInstallationApi(selectedPlugin.id);
      if (status === 200) {
        dispatch(handleChangeSelectedPlugin(data));
        setInstallStarted(true);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (file) {
      setFileIsSelected(true);
      setUploadStarted(true);
    } else {
      setFileIsSelected(false);
      setFileUploaded(false);
      setUploadStarted(false);
      setUploadPercentage(0);
    }
  }, [file]);

  useEffect(() => {
    if (installStarted) {
      const countdown = () => {
        if (installPercentage < 99) {
          // handleGetInstallationProgress();
          setInstallPercentage((prev) => prev + 1);
        } else {
          // setPluginInstalled(true);
          // setInstallStarted(false);
        }
      };
      setTimeout(countdown, Math.floor(Math.random() * 1000) + 500);
    }
    if (installStarted && installPercentage === 1) {
      handleGetInstallationProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installStarted, installPercentage]);

  useEffect(() => {
    if (selectedPlugin && currentStep === ADDPLUGINSTEPS.PreparingForInstall) {
      if (selectedPlugin.status === PLUGINSTATUS.ParsingStarted) {
        const countdown = () => {
          if (selectedPlugin.status === PLUGINSTATUS.ParsingStarted) handleGetInstallationProgress();
        };
        setTimeout(countdown, 7000);
      } else if (selectedPlugin.status === PLUGINSTATUS.ParsingFinished) {
        setCurrentStep(ADDPLUGINSTEPS.Installation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, selectedPlugin]);

  useEffect(() => {
    if (selectedPlugin && currentStep === ADDPLUGINSTEPS.Upload) {
      if (selectedPlugin.status === PLUGINSTATUS.Configuration) {
        setCurrentStep(ADDPLUGINSTEPS.Setup);
        setPluginType(selectedPlugin.type);
      }

      setCode(selectedPlugin.original_function_body ?? '');

      setUpdateWithTextEditor(true);
    }

    if (selectedPlugin && selectedPlugin.status === PLUGINSTATUS.ParsingStarted) {
      toast.loading('The installation process is underway', {duration: 5000});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlugin]);

  useEffect(() => {
    if (currentStep === ADDPLUGINSTEPS.Installation) {
      handleStartInstallationApi();
    }
    if (currentStep === ADDPLUGINSTEPS.Setup && !resources) {
      getResources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    if (uploadStarted) {
      const countdown = () => {
        if (uploadPercentage >= 100) {
          setFileUploaded(true);
          setUploadStarted(false);
        } else {
          setUploadPercentage((percent) => ++percent);
        }
      };
      setTimeout(countdown, 10);
    }
  }, [uploadStarted, uploadPercentage]);

  const handleDownloadOriginalFunctionBody = async () => {
    if (!selectedPlugin) return;
    setDownloadIsLoading(true);
    try {
      const {status, data} = await downloadOriginalFunctionBodyApi(selectedPlugin.id);
      if (status === 200) {
        downloadAs(data, `original-function-body-${selectedPlugin.original_file_name}`);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setDownloadIsLoading(false);
    }
  };

  const handleDownloadProcessedFunctionBody = async () => {
    if (!selectedPlugin) return;
    setDownloadIsLoading(true);
    try {
      const {status, data} = await downloadProcessedFunctionBodyApi(selectedPlugin.id);
      if (status === 200) {
        downloadAs(data, `processed-function-body-${selectedPlugin.original_file_name}`);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setDownloadIsLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-grey-900/50 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className='w-full max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-modal-xxl h-[calc(100vh-64px)] max-h-[652px] flex flex-col
                transform border border-content-primary bg-grey-100 custom-scrollbar-thumb
                 pb-6 pt-7 px-8 md:pb-7 md:pt-9 md:px-12 xl:px-16 rounded-xl align-middle shadow-xl transition-all'
                >
                  <UploadPluginModalHeaderSection
                    ADDPLUGINSTEPS={ADDPLUGINSTEPS}
                    currentStep={currentStep}
                    pluginStatus={selectedPlugin?.status}
                    handleCloseModal={handleCloseModal}
                  />

                  <div className='flex flex-col flex-auto justify-between '>
                    {currentStep === ADDPLUGINSTEPS.Upload && (
                      <>
                        {selectedPlugin && updateWithTextEditor ? (
                          <>
                            <div className='flex-1'>
                              <div className='custom-scrollbar-thumb max-h-[330px]'>
                                <CodeEditor
                                  value={code}
                                  language='python'
                                  placeholder='Please enter Python code.'
                                  onChange={(evn) => setCode(evn.target.value)}
                                  padding={16}
                                  style={{
                                    backgroundColor: '#f5f5f5',
                                    fontFamily:
                                      'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                  }}
                                />
                              </div>
                            </div>
                            <div className='flex gap-4 flex-col mb-4'>
                              <div className='flex h-10 gap-6 items-center'>
                                <IconButton
                                  className=''
                                  onClick={() => setUpdateWithTextEditor(false)}
                                  variant='primary'
                                >
                                  <DocumentIcon className='w-6 h-6 text-grey-0' />
                                </IconButton>

                                <CustomCheckbox
                                  active={bypassCodeCheck}
                                  onChange={setBypassCodeCheck}
                                  title={'Bypass Code Check'}
                                />
                                {/* <Button type='button' variant='primary' title='switch to uploader' /> */}
                              </div>
                              <div className='flex flex-wrap gap-6'>
                                <div
                                  className={classNames(
                                    'flex items-center text-sm bg-primary hover:accent-primary-medium text-grey-0 shadow-sm hover:shadow-lg shadow-primary/50 px-3 py-2 rounded-2xl transition-all duration-150 gap-2 cursor-pointer',
                                    downloadIsLoading && 'pointer-events-none',
                                  )}
                                  onClick={handleDownloadOriginalFunctionBody}
                                >
                                  <ArrowDownTrayIcon className='w-5 h-5 rounded-full text-grey-0' />
                                  original function body
                                </div>
                                <div
                                  className={classNames(
                                    'flex items-center text-sm bg-primary hover:accent-primary-medium text-grey-0 shadow-sm hover:shadow-lg shadow-primary/50 px-3 py-2 rounded-2xl transition-all duration-150 gap-2 cursor-pointer',
                                    downloadIsLoading && 'pointer-events-none',
                                  )}
                                  onClick={handleDownloadProcessedFunctionBody}
                                >
                                  <ArrowDownTrayIcon className='w-5 h-5 rounded-full text-grey-0' />
                                  processed function body
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div
                            className={classNames(
                              'flex flex-col flex-1',
                              !fileIsSelected && !file && 'justify-between',
                            )}
                          >
                            <div
                              onDrop={(e) => handleDropFiles(e)}
                              onDragOver={handleDragFiles}
                              className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6 bg-grey-0 border-2 border-primary border-dashed rounded-xl '
                            >
                              <IconButton
                                className='top-4 right-4 block mx-auto primary-soft/15 mb-5'
                                onClick={(e) => {
                                  e.preventDefault();
                                  inputFileRef.current?.click();
                                }}
                              >
                                <ArrowUpTrayIcon className='text-primary-medium' width={20} height={20} />
                              </IconButton>
                              <h6 className='font-semibold text-sm text-grey-800 mb-3'>Drag & drop file to upload</h6>
                              <p className='text-xs text-grey-600 '>Files in .py file format only</p>
                              <input
                                type='file'
                                className='hidden'
                                hidden
                                ref={inputFileRef}
                                onChange={(e) => handleCustomSelectFile(e)}
                              />
                            </div>
                            {fileIsSelected && !!file ? (
                              <div className='flex flex-wrap py-3 px-8 bg-grey-0 rounded-xl w-full items-center justify-between relative'>
                                <div className='flex gap-4 items-center max-w-full'>
                                  <div className='flex w-56 pr-2 items-center'>
                                    {fileUploaded ? (
                                      <CheckIcon width={24} height={24} className='text-grey-600' />
                                    ) : (
                                      <ClipboardDocumentIcon width={24} height={24} className='text-grey-600' />
                                    )}
                                    <p className='font-semibold text-xs text-grey-900 ml-3 truncate overflow-auto max-w-[calc(100%-36px)]'>
                                      {file.name}
                                    </p>
                                  </div>
                                  <span className='text-xs text-grey-600 lg:w-28  ml-auto lg:ml-0 text-right'>
                                    {bytesCalculator(file.size)}
                                  </span>
                                </div>
                                <div className='flex justify-end items-center gap-6'>
                                  {(uploadStarted || fileUploaded) && (
                                    <div className='flex items-center gap-2 max-w-full'>
                                      <div className='h-1.5 bg-grey-100 dark:bg-neutral-600 w-[170px] '>
                                        <div
                                          className='h-1.5 bg-primary transition-all'
                                          style={{width: `${uploadPercentage}%`}}
                                        ></div>
                                      </div>
                                      <span className='text-grey-900 text-xs font-medium tracking-[-1px] flex items-center'>
                                        {`${uploadPercentage} %`}
                                      </span>
                                    </div>
                                  )}
                                  <IconButton className='!p-0' onClick={handleDeleteFile}>
                                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                                  </IconButton>
                                </div>
                              </div>
                            ) : (
                              selectedPlugin && (
                                <div className='flex h-10 mb-3 gap-6 items-center'>
                                  <IconButton
                                    className=''
                                    onClick={() => setUpdateWithTextEditor(true)}
                                    variant='primary'
                                  >
                                    <CodeBracketIcon className='w-6 h-6 text-grey-0' />
                                  </IconButton>

                                  <CustomCheckbox
                                    active={bypassCodeCheck}
                                    onChange={setBypassCodeCheck}
                                    title={'Bypass Code Check'}
                                  />
                                </div>
                              )
                            )}
                            {!selectedPlugin && (
                              <div className='flex h-10 mb-3 gap-6 pl-16 items-center mt-auto'>
                                <CustomCheckbox
                                  active={bypassCodeCheck}
                                  onChange={setBypassCodeCheck}
                                  title={'Bypass Code Check'}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {currentStep === ADDPLUGINSTEPS.Setup && selectedPlugin && (
                      <ConfigurationSection
                        activatedCPU={activatedCPU}
                        plugin={selectedPlugin}
                        resources={resources}
                        fileSize={file?.size}
                        setActivatedCPU={setActivatedCPU}
                        pluginType={pluginType}
                        setPluginType={setPluginType}
                        setColor={setColor}
                        selectedColor={color}
                      />
                    )}
                    {selectedPlugin &&
                      currentStep === ADDPLUGINSTEPS.PreparingForInstall &&
                      selectedPlugin.status === PLUGINSTATUS.ParsingStarted && <InstallationStartedSection />}
                    {selectedPlugin && selectedPlugin.status === PLUGINSTATUS.Error && (
                      <div className='flex flex-col flex-auto'>
                        <div className='w-full pt-24 px-7 pb-4'>
                          <div className='flex flex-col items-center justify-center w-full max-h-96 bg-grey-0 rounded-xl p-5'>
                            <ExclamationTriangleIcon className='text-danger mb-8' width={36} height={36} />
                            <h1 className='font-semibold text-center text-xxl mb-6 text-danger-500'>
                              The system has detected an error
                            </h1>
                            <h2 className='font-semibold text-center text-xl mb-6 text-danger-300'>
                              {`Error: ${selectedPlugin.parser_feedback}`}
                            </h2>
                          </div>
                        </div>
                      </div>
                    )}
                    {currentStep === ADDPLUGINSTEPS.Installation && selectedPlugin && (
                      <InstallationPluginSection
                        installPercentage={installPercentage}
                        processed_function_body={
                          selectedPlugin.processed_function_body ?? selectedPlugin.original_function_body
                        }
                      />
                    )}

                    <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1'>
                      {currentStep === ADDPLUGINSTEPS.Upload || currentStep === ADDPLUGINSTEPS.Installation ? (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant='outline'
                          title='Cancel'
                          onClick={handleCloseModal}
                        />
                      ) : (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant='outline'
                          title='Back'
                          onClick={() => setCurrentStep((currentStep) => --currentStep)}
                        />
                      )}
                      {currentStep === ADDPLUGINSTEPS.Upload && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={fileUploaded || selectedPlugin ? 'primary' : 'disabled'}
                          title={!loading ? 'Continue' : ''}
                          loading={loading}
                          disabled={loading || (!fileUploaded && !selectedPlugin)}
                          onClick={handleSubmitFirstStep}
                        />
                      )}
                      {currentStep === ADDPLUGINSTEPS.Setup && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={'primary'}
                          title='Continue'
                          loading={loading}
                          disabled={loading}
                          onClick={handleSubmitSecondStep}
                        />
                      )}
                      {currentStep === ADDPLUGINSTEPS.Installation && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={pluginInstalled ? 'primary' : 'disabled'}
                          title='Continue'
                          loading={loading}
                          disabled={loading || !pluginInstalled}
                          onClick={handleCloseModal}
                        />
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
