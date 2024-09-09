import React, {ChangeEvent, DragEvent, Fragment, useEffect, useRef, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {
  ArrowUpTrayIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

import {APPSTATUS} from '@/constant';
import {bytesCalculator} from '@/helpers';
import {IApp} from '@/types';

import {Button, IconButton} from '../buttons';
import {Spinner} from '../spinner';

// import Highlight from 'react-highlight';
// import {
//   addAppConfigurationApi,
//   getAppByIdApi,
//   getServerResourcesApi,
//   startAppInstallationApi,
//   uploadNewAppApi,
// } from '@/services/auth.service';

const DynamicHighlight = dynamic(async () => (await import('react-highlight')).default, {
  ssr: false,
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});

const ADDAPPSTEPS = {Upload: 1, Setup: 2, PreparingForInstall: 3, Installation: 4};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const UploadAppModal = ({open, onClose}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File>();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(ADDAPPSTEPS.Upload);

  const [selectedApp, setSelectedApp] = useState<IApp | null>(null);

  // const [setupEnv, setSetupEnv] = useState(SetupEnvironment);
  // const [resources, setResources] = useState<IResources>();
  // const [deviceMapConfig, setDeviceMapConfig] = useState({cpu: false});

  const [installStarted, setInstallStarted] = useState(false);
  const [installPercentage, setInstallPercentage] = useState(0);
  const [pluginInstalled, setAppInstalled] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  // const {getAllApps} = useAuthContext();

  const handleSubmitSecondStep = async () => {
    // if (fileUploaded && currentStep === ADDAPPSTEPS.Setup) {
    //   setLoading(true);
    //   if (!selectedApp || !resources) return;
    //   try {
    //     const {status, data} = await addAppConfigurationApi(selectedApp.id, resources.device_map);
    //     if (status === 200) {
    //       setSelectedApp(data);
    //       toast.success('upload successfull');
    //       setCurrentStep(ADDAPPSTEPS.PreparingForInstall);
    //     }
    //   } catch (err) {
    //     if (err instanceof AxiosError) {
    //       toast.error(err?.response?.data.error);
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  };

  const handleSubmitFirstStep = async () => {
    // if (fileUploaded && file && currentStep === ADDAPPSTEPS.Upload) {
    //   setLoading(true);
    //   const newFile = new File([file], file.name, {type: 'application/octet-stream'});
    //   const formData = new FormData();
    //   formData.append('file', newFile);
    //   try {
    //     const {status, data} = await uploadNewAppApi(formData);
    //     if (status === 201) {
    //       setSelectedApp(data);
    //       setCurrentStep(ADDAPPSTEPS.Setup);
    //       toast.success('upload successfull');
    //     }
    //   } catch (err) {
    //     if (err instanceof AxiosError) {
    //       toast.error(err?.response?.data.error);
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // }
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
    // if (currentStep === ADDAPPSTEPS.Setup) {
    //   try {
    //     const {status, data} = await getServerResourcesApi();
    //     if (status === 200) {
    //       setResources(data);
    //     }
    //   } catch (err) {
    //     if (err instanceof AxiosError) {
    //       toast.error(err?.response?.data.error);
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // }
  };
  const handleDeleteFile = () => {
    setFile(undefined);
  };
  // const handleCheckFileIsValid = (file: File) => {
  //   if (file.name.includes(VALIDAPPFILE.Format) && file.type.includes(VALIDAPPFILE.Type)) {
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
    setCurrentStep(ADDAPPSTEPS.Upload);
    setInstallStarted(false);
    setInstallPercentage(0);
    setAppInstalled(false);
    setLoading(false);
    setSelectedApp(null);
    onClose();
  };

  // const handleChangeSetup = (check: boolean, inx: number) => {
  //   const result = [...setupEnv];
  //   result[inx].active = check;

  //   // const setup = {...setupEnv[inx],active:check};
  //   setSetupEnv(result);
  // };

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
          // setAppInstalled(true);
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
    if (selectedApp && currentStep === ADDAPPSTEPS.PreparingForInstall) {
      console.log({
        selectedAppStatus: selectedApp.status,
        expected: APPSTATUS.ParsingFinished,
        selectedApp,
      });
      if (selectedApp.status === APPSTATUS.ParsingStarted) {
        console.log('App ParsingStarted...' + selectedApp.status);
        const countdown = () => {
          if (selectedApp.status === APPSTATUS.ParsingStarted) handleGetInstallationProgress();
        };
        setTimeout(countdown, 7000);
      } else if (selectedApp.status === APPSTATUS.ParsingFinished) {
        console.log('App ParsingFinished...' + selectedApp.status);
        setCurrentStep(ADDAPPSTEPS.Installation);
      }
    }
  }, [currentStep, selectedApp]);

  const handleGetInstallationProgress = async () => {
    // if (!selectedApp) return;
    // try {
    //   const {status, data} = await getAppByIdApi(selectedApp.id);
    //   if (status === 200) {
    //     setSelectedApp(data);
    //     if (data.progress) {
    //       setInstallPercentage(data.progress);
    //     }
    //     if (data.progress === 100) {
    //       setAppInstalled(true);
    //       setInstallStarted(false);
    //     }
    //   }
    // } catch (err) {
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // }
  };

  const handleStartInstallationApi = async () => {
    // if (!selectedApp) return;
    // setLoading(true);
    // try {
    //   const {status, data} = await startAppInstallationApi(selectedApp.id);
    //   if (status === 200) {
    //     setSelectedApp(data);
    //     toast.success('installation started');
    //     setInstallStarted(true);
    //   }
    // } catch (err) {
    //   if (err instanceof AxiosError) {
    //     toast.error(err?.response?.data.error);
    //   }
    // } finally {
    //   setLoading(false);
    // }
    setInstallStarted(true);
  };
  useEffect(() => {
    if (currentStep === ADDAPPSTEPS.Installation) {
      handleStartInstallationApi();
    }
  }, [currentStep]);

  useEffect(() => {
    getResources();
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
                transform border border-content-primary bg-grey-100
                 pb-6 pt-7 px-8 md:pb-8 md:pt-9 md:px-12 xl:pb-11 xl:pt-12 xl:px-16 rounded-xl align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-16 relative'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-grey-900 text-left absolute left-0 top 0'
                    >
                      Upload
                    </Dialog.Title>
                    <div className='flex mx-auto'>
                      <div className='flex text-xs items-center'>
                        <div
                          className={`flex items-center justify-center rounded-xl px-4 mx-1 h-7 ${
                            currentStep >= ADDAPPSTEPS.Upload
                              ? 'bg-primary-400/10 text-primary-medium font-semibold'
                              : 'text-grey-600 bg-grey-0 font-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= ADDAPPSTEPS.Upload ? (
                              '1. Upload'
                            ) : (
                              <>
                                <CheckIcon width={16} height={16} />
                                Done
                              </>
                            )}
                          </span>
                        </div>
                        <span className='w-6 h-1px bg-primary-150' />
                        <div
                          className={`flex items-center justify-center rounded-xl px-4 mx-1 h-7 ${
                            currentStep >= ADDAPPSTEPS.Setup
                              ? 'bg-primary-400/10 text-primary-medium font-semibold'
                              : 'text-grey-600 bg-grey-0 font-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= ADDAPPSTEPS.Setup ? (
                              '2. Setup'
                            ) : (
                              <>
                                <CheckIcon width={16} height={16} />
                                Done
                              </>
                            )}
                          </span>
                        </div>
                        <span className='w-6 h-1px bg-primary-150' />
                        <div
                          className={`flex items-center justify-center rounded-xl px-4 mx-1 h-7 ${
                            currentStep >= ADDAPPSTEPS.Installation
                              ? 'bg-primary-400/10 text-primary-medium font-semibold'
                              : 'text-grey-600 bg-grey-0 font-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= ADDAPPSTEPS.Installation ? (
                              '3. Installation'
                            ) : (
                              <>
                                <CheckIcon width={16} height={16} />
                                Done
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <IconButton className='absolute top-0 right-1' onClick={handleCloseModal}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex flex-col flex-auto justify-between '>
                    {/* <form
                      className='h-full flex flex-col justify-between max-h-[calc(100%-61px)]'
                      onSubmit={
                        fileUploaded && currentStep === ADDAPPSTEPS.Upload
                          ? handleSubmitFirstStep
                          : handleSubmit(onSubmit)
                      }
                    > */}
                    {currentStep === ADDAPPSTEPS.Upload && (
                      <div className=' flex flex-col '>
                        <div
                          onDrop={(e) => handleDropFiles(e)}
                          onDragOver={handleDragFiles}
                          className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6
                        bg-grey-0 border-2 border-primary border-dashed rounded-xl '
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
                        {fileIsSelected && !!file && (
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
                        )}
                      </div>
                    )}

                    {currentStep === ADDAPPSTEPS.Setup && !!file && (
                      <div className='flex flex-col lg:flex-row gap-8 justify-between'>
                        <div className='flex flex-col w-5/12'>
                          <div className='flex gap-3 mb-6'>
                            <span className='w-11 h-11 rounded-full bg-primary-400/10 flex justify-center items-center'>
                              <ClipboardDocumentIcon className='text-secondary-700' width={20} height={20} />
                            </span>
                            <div className='flex flex-col justify-evenly text-left'>
                              <h5 className='font-semibold text-grey-900 text-sm'>{file.name}</h5>
                              <p className='text-grey-600 font-normal text-xs leading-5'>
                                {bytesCalculator(file.size)}
                              </p>
                            </div>
                          </div>
                          <div className='flex'>
                            <p className='text-grey-600 text-xs leading-5 text-left max-w-md'>
                              Enhance your ChatGPT experience with ImageFlow Connect – a powerful plugin that seamlessly
                              integrates image uploading capabilities into your conversations.
                              <br />
                              <br />
                              With ImageFlow Connect, you can effortlessly share visual context by uploading images
                              directly within the chat interface.
                            </p>
                          </div>
                        </div>

                        <div className='flex flex-col w-full lg:w-7/12 max-w-[452px]'>
                          <h5 className='text-sm font-semibold text-grey-900 mb-8 text-left'>
                            Assign a plugin to computer resources
                          </h5>

                          {/* {resources && resources.device_map.cpu && (
                            <div className='flex flex-col gap-3 mb-3'>
                              <div className='w-full flex bg-grey-0 rounded-4xl px-6 py-3 h-45-px items-center'>
                                <CustomCheckbox
                                  active={deviceMapConfig.cpu}
                                  onChange={(check: boolean) => setDeviceMapConfig((prev) => ({...prev, cpu: check}))}
                                  title={`cpu`}
                                  description={resources.device_map.cpu}
                                />
                                <span className='text-grey-600 text-xs ml-auto'>{`${resources.memory_free} of ${resources.memory_total}`}</span>
                              </div>
                            </div>
                          )} */}

                          {/* {setupEnv.map((setup, inx) => (
                            <div key={setup.id} className='flex flex-col gap-3 mb-3'>
                              <div className='w-full flex bg-grey-0 rounded-4xl px-6 py-3 h-45-px items-center'>
                                <CustomCheckbox
                                  active={setup.active}
                                  onChange={(check: boolean) => handleChangeSetup(check, inx)}
                                  title={setup.title}
                                  description={setup.desc}
                                />
                                <span className='text-grey-600 text-xs ml-auto'>{setup.space}</span>
                              </div>
                            </div>
                          ))} */}
                        </div>
                      </div>
                    )}
                    {selectedApp && selectedApp.status === APPSTATUS.ParsingStarted && (
                      <div className='flex flex-col flex-auto h-full w-full px-7'>
                        <div className='flex gap-4 items-center justify-center w-full bg-grey-0 rounded-xl p-5 h-full'>
                          <div className='scale-150'>
                            <Spinner />
                          </div>
                          <h1 className='flex text-primary text-xxl uppercase font-bold '>
                            Preparing to install the plugin
                          </h1>
                        </div>
                      </div>
                    )}
                    {selectedApp && selectedApp.status === APPSTATUS.Error && (
                      <div className='flex flex-col flex-auto'>
                        <div className='w-full pt-24 px-7'>
                          <div className='flex flex-col items-center justify-center w-full max-h-96 bg-grey-0 rounded-xl p-5'>
                            <ExclamationTriangleIcon className='text-danger mb-8' width={36} height={36} />
                            <h1 className='font-semibold text-center text-xxl mb-6 text-danger-500'>
                              The system has detected an error
                            </h1>
                            <h2 className='font-semibold text-center text-xl mb-6 text-danger-300'>
                              {`Error: ${selectedApp.parser_feedback}`}
                            </h2>
                          </div>
                        </div>
                      </div>
                    )}
                    {currentStep === ADDAPPSTEPS.Installation && selectedApp && (
                      <div className='flex flex-col flex-auto'>
                        <div className='flex flex-col mb-6'>
                          <div className='flex justify-between mb-3 items-center'>
                            {installPercentage > 99 ? (
                              <div className='flex gap-3 items-center ml-auto'>
                                <span className='w-7 h-7 rounded-full bg-secondary/[0.11] flex items-center justify-center'>
                                  <CheckIcon width={16} height={16} className='text-secondary' />
                                </span>
                                <p className='text-grey-900 font-semibold text-xs leading-5'>
                                  The plugin is successfully installed
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className='text-grey-800 text-sm'>The plugin is installing, please wait</p>
                                <span className='text-grey-900 text-xs font-medium tracking-[-1px] flex items-center'>
                                  {`${installPercentage < 100 ? installPercentage : 100} %`}
                                </span>
                              </>
                            )}
                          </div>
                          <div className='h-1.5 bg-grey-0 dark:bg-neutral-600 w-full '>
                            <div
                              className={`h-1.5 transition-all duration-200 ${
                                installPercentage > 99 ? 'bg-secondary' : 'bg-primary w-0'
                              }`}
                              style={{width: `${installPercentage < 100 ? installPercentage : 100}%`}}
                            ></div>
                          </div>
                        </div>
                        <div className='w-full flex-auto py-4 px-5 overflow-auto bg-grey-900 text-left rounded-xl max-h-[342px] custom-scrollbar-thumb'>
                          <DynamicHighlight
                            innerHTML={false}
                            className='text-grey-0 [&_.hljs-keyword]:text-secondary-600 [&_.hljs-string]:text-secondary [&_.hljs-selector-class]:text-danger-300
                           [&_.hljs-attribute]:text-yellow-300 [&_.hljs-comment]:text-grey-400 [&_.hljs-comment]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500 
                           [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500  '
                          >
                            {selectedApp.original_function_body}
                          </DynamicHighlight>
                        </div>
                      </div>
                    )}

                    <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1'>
                      <Button
                        type='button'
                        className='flex-1 !h-11'
                        variant='outline'
                        title='Cancel'
                        onClick={handleCloseModal}
                      />
                      {currentStep === ADDAPPSTEPS.Upload && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={fileUploaded ? 'primary' : 'disabled'}
                          title={!loading ? 'Continue' : ''}
                          loading={loading}
                          disabled={loading || !fileUploaded}
                          onClick={handleSubmitFirstStep}
                        />
                      )}
                      {currentStep === ADDAPPSTEPS.Setup && (
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
                      {currentStep === ADDAPPSTEPS.Installation && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={pluginInstalled ? 'primary' : 'disabled'}
                          title='Continue'
                          loading={loading}
                          disabled={loading || !pluginInstalled}
                          onClick={() => {
                            // getAllApps();
                            handleCloseModal();
                          }}
                        />
                      )}
                    </div>
                    {/* </form> */}
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
