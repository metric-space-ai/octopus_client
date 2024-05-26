import React, {Fragment, useState, useEffect, useRef, ChangeEvent, DragEvent} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {AxiosError} from 'axios';

import {
  ArrowUpTrayIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CodeBracketIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import CodeEditor from '@uiw/react-textarea-code-editor';

import {Button, IconButton} from '../../../buttons';
import toast from 'react-hot-toast';
import {bytesCalculator} from '@/helpers';

import {PLUGINSTATUS} from '@/constant';
import {
  addPluginConfigurationApi,
  getPluginByIdApi,
  getServerResourcesApi,
  startPluginInstallationApi,
  updatePluginByIdApi,
  uploadNewPluginApi,
} from '@/services/settings.service';
import {getAllPlugins, handleChangeSelectedPlugin} from '@/app/lib/features/aiServices/aiServicesSlice';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/app/lib/store';
import {IDeviceMap, IPlugin, IResources} from '@/types';
import {selectAiServicess} from '@/app/lib/features/aiServices/aiServicesSelector';
import {useSelector} from 'react-redux';
import InstallationPluginSection from './InstallationPluginSection';
import InstallationStartedSection from './InstallationStartedSection';
import ConfigurationSection from './ConfigurationSection';
import UploadPluginModalHeaderSection from './UploadPluginModalHeaderSection';
import classNames from 'classnames';
import CustomCheckbox from '@/components/custom-checkbox';

const VALIDPLUGINFILE = {Format: '.py', Type: 'text/x-python'};
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
  const [bypassCodeCheck, setBypassCodeCheck] = useState(false);
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
  const handleCheckFileIsValid = (file: File) => {
    if (file.name.includes(VALIDPLUGINFILE.Format) && file.type.includes(VALIDPLUGINFILE.Type)) {
      setFile(file);
    } else {
      toast.error(
        `An incorrect file has been selected for the selected file. format:${file.name} _ type:${file.type} The expected format is "*.py" and valid type is "text/x-python"`,
      );
    }
  };

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
  }, [selectedPlugin]);

  useEffect(() => {
    if (currentStep === ADDPLUGINSTEPS.Installation) {
      handleStartInstallationApi();
    }
    if (currentStep === ADDPLUGINSTEPS.Setup && !resources) {
      getResources();
    }
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
            <div className='fixed inset-0 bg-black/50 transition-opacity' />
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
                transform border border-content-primary bg-content-grey-100 custom-scrollbar-thumb
                 pb-6 pt-7 px-8 md:pb-8 md:pt-9 md:px-12 xl:pb-11 xl:pt-12 xl:px-16 rounded-[20px] align-middle shadow-xl transition-all'
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
                            <div className='h-[360px] max-h-full custom-scrollbar-thumb'>
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
                            <div className='flex h-10 gap-6 items-center'>
                              <IconButton className='' onClick={() => setUpdateWithTextEditor(false)} variant='primary'>
                                <DocumentIcon className='w-6 h-6 text-content-white' />
                              </IconButton>

                              <CustomCheckbox
                                active={bypassCodeCheck}
                                onChange={setBypassCodeCheck}
                                title={'Bypass Code Check'}
                              />
                              {/* <Button type='button' variant='primary' title='switch to uploader' /> */}
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
                              className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6 bg-white border-2 border-content-accent border-dashed rounded-20 '
                            >
                              <IconButton
                                className='top-4 right-4 block mx-auto bg-content-accent-light-15 mb-5'
                                onClick={(e) => {
                                  e.preventDefault();
                                  inputFileRef.current?.click();
                                }}
                              >
                                <ArrowUpTrayIcon className='text-content-accent-hover' width={20} height={20} />
                              </IconButton>
                              <h6 className='font-poppins-semibold text-sm text-content-grey-900 mb-3'>
                                Drag & drop file to upload
                              </h6>
                              <p className='text-xs text-content-grey-600 '>Files in .py file format only</p>
                              <input
                                type='file'
                                className='hidden'
                                hidden
                                ref={inputFileRef}
                                onChange={(e) => handleCustomSelectFile(e)}
                              />
                            </div>
                            {fileIsSelected && !!file ? (
                              <div className='flex flex-wrap py-3 px-8 bg-content-white rounded-20 w-full items-center justify-between relative'>
                                <div className='flex gap-4 items-center max-w-full'>
                                  <div className='flex w-56 pr-2 items-center'>
                                    {fileUploaded ? (
                                      <CheckIcon width={24} height={24} className='text-content-grey-600' />
                                    ) : (
                                      <ClipboardDocumentIcon width={24} height={24} className='text-content-grey-600' />
                                    )}
                                    <p className='font-semibold text-xs text-content-black ml-3 truncate overflow-auto max-w-[calc(100%-36px)]'>
                                      {file.name}
                                    </p>
                                  </div>
                                  <span className='text-xs text-content-grey-600 lg:w-28  ml-auto lg:ml-0 text-right'>
                                    {bytesCalculator(file.size)}
                                  </span>
                                </div>
                                <div className='flex justify-end items-center gap-6'>
                                  {(uploadStarted || fileUploaded) && (
                                    <div className='flex items-center gap-2 max-w-full'>
                                      <div className='h-1.5 bg-content-grey-100 dark:bg-neutral-600 w-[170px] '>
                                        <div
                                          className='h-1.5 bg-content-accent transition-all'
                                          style={{width: `${uploadPercentage}%`}}
                                        ></div>
                                      </div>
                                      <span className='text-content-black text-xs font-poppins-medium tracking-[-1px] flex items-center'>
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
                                    <CodeBracketIcon className='w-6 h-6 text-content-white' />
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
                        file_name={selectedPlugin.original_file_name}
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
                        <div className='w-full pt-24 px-7'>
                          <div className='flex flex-col items-center justify-center w-full max-h-96 bg-white rounded-20 p-5'>
                            <ExclamationTriangleIcon className='text-red-500 mb-8' width={36} height={36} />
                            <h1 className='font-poppins-semibold text-center text-xxl mb-6 text-content-red-600'>
                              The system has detected an error
                            </h1>
                            <h2 className='font-poppins-semibold text-center text-xl mb-6 text-content-red-400'>
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
