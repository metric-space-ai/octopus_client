import React, {Fragment, useState, useEffect, useRef, ChangeEvent, DragEvent} from 'react';

import {Dialog, Transition} from '@headlessui/react';

import {
  ArrowUpTrayIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

import {Button, IconButton} from '../buttons';
import toast from 'react-hot-toast';
import {bytesCalculator} from '@/helpers';
import CustomCheckbox from '../custom-checkbox';
import _Highlight from 'react-highlight';
import {
  addPluginConfigurationApi,
  getPluginByIdApi,
  getServerResourcesApi,
  startPluginInstallationApi,
  uploadNewPluginApi,
} from '@/services/auth.service';
import {AxiosError} from 'axios';
import {IPlugin, IResources} from '@/types/plugin';
import {useAuthContext} from '@/contexts/authContext';
import CustomRadiobox from '../custom-radiobox';

const VALIDPLUGINFILE = {Format: '.py', Type: 'text/x-python'};
const ADDDOCUMENTSSTEPS = {Upload: 1, Setup: 2};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const Highlight = React.memo(_Highlight);

const SetupEnvironment = [
  {
    id: 'setup_1',
    title: 'CPU',
    desc: 'Intel Core i7-13700K',
    space: '8GB of 16GB',
    active: false,
  },
  {
    id: 'setup_2',
    title: 'GPU (Discrete)',
    desc: 'NVIDIA GeForce MX250',
    space: '9GB of 11GB',
    active: false,
  },
  {
    id: 'setup_3',
    title: 'GPU (Integrated)',
    desc: 'Intel UHD Graphics',
    space: '0.7GB of 2GB',
    active: false,
  },
];

export const UploadDocumentModal = ({open, onClose}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File>();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(ADDDOCUMENTSSTEPS.Upload);

  const [selectedPlugin, setSelectedPlugin] = useState<IPlugin | null>(null);

  const [active, setActive] = useState(false);
  const [setupFormIsValid, setSetupFormIsValid] = useState(false);
  const [setupEnv, setSetupEnv] = useState(SetupEnvironment);
  const [resources, setResources] = useState<IResources>();

  const [deviceMapConfig, setDeviceMapConfig] = useState({cpu: false});

  const [installStarted, setInstallStarted] = useState(false);
  const [installPercentage, setInstallPercentage] = useState(0);
  const [pluginInstalled, setPluginInstalled] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const {getAllPlugins} = useAuthContext();

  const handleSubmitSecondStep = async () => {};

  const handleSubmitFirstStep = async () => {
    if (fileUploaded && file && currentStep === ADDDOCUMENTSSTEPS.Upload) {
      setLoading(true);
      const newFile = new File([file], file.name, {type: 'application/octet-stream'});

      const formData = new FormData();
      formData.append('file', newFile);
      console.log({file, newFile, formData});
      // try {
      //   const {status, data} = await uploadNewPluginApi(formData);
      //   if (status === 201) {
      //     setSelectedPlugin(data);
      //     setCurrentStep(ADDDOCUMENTSSTEPS.Setup);
      //     toast.success('upload successfull');
      //   }
      // } catch (err) {
      //   if (err instanceof AxiosError) {
      //     toast.error(err?.response?.data.error);
      //   }
      // } finally {
      //   setLoading(false);
      // }
      setLoading(false);
    }
  };

  const handleDragFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleCheckFileIsValid(e.dataTransfer.files[0]);
  };
  const handleCustomSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleCheckFileIsValid(e.target.files[0]);
    }
  };

  const handleDeleteFile = () => {
    setFile(undefined);
  };
  const handleCheckFileIsValid = (file: File) => {
    console.log({file});
    // if (file.name.includes(VALIDPLUGINFILE.Format) && file.type.includes(VALIDPLUGINFILE.Type)) {
    setFile(file);
    // } else {
    //   toast.error(
    //     `An incorrect file has been selected for the selected file. format:${file.name} _ type:${file.type} The expected format is "*.py" and valid type is "text/x-python"`,
    //   );
    // }
  };

  const handleCloseModal = () => {
    setUploadStarted(false);
    setUploadPercentage(0);
    setFile(undefined);
    setFileIsSelected(false);
    setFileUploaded(false);
    setCurrentStep(ADDDOCUMENTSSTEPS.Upload);
    setActive(false);
    setSetupFormIsValid(false);
    setInstallStarted(false);
    setInstallPercentage(0);
    setPluginInstalled(false);
    setLoading(false);

    onClose();
  };

  const handleChangeSetup = (check: boolean, inx: number) => {
    const result = [...setupEnv];
    result[inx].active = check;

    // const setup = {...setupEnv[inx],active:check};
    setSetupEnv(result);
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

  const handleGetInstallationProgress = async () => {
    if (!selectedPlugin) return;
    try {
      const {status, data} = await getPluginByIdApi(selectedPlugin.id);
      if (status === 200) {
        setSelectedPlugin(data);
        setInstallPercentage(data.progress);
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

  useEffect(() => {
    if (uploadStarted) {
      const countdown = () => {
        if (uploadPercentage >= 100) {
          setFileUploaded(true);
          console.log(`uploaded`);
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
                transform border border-content-primary bg-content-grey-100
                 pb-6 pt-7 px-8 md:pb-8 md:pt-9 md:px-12 xl:pb-11 xl:pt-12 xl:px-16 rounded-[20px] align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-16 relative'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-content-black font-poppins-semibold text-left absolute left-0 top 0'
                    >
                      Upload document
                    </Dialog.Title>

                    <IconButton className='absolute top-0 right-1' onClick={handleCloseModal}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex flex-col flex-auto justify-between '>
                    {currentStep === ADDDOCUMENTSSTEPS.Upload && (
                      <div className=' flex flex-col '>
                        {fileIsSelected && !!file ? (
                          <>
                          <div className='flex flex-wrap py-3 px-8 bg-content-white rounded-20 w-full items-center justify-between relative'>
                            <div className='flex gap-4 items-center max-w-full'>
                              <div className='flex w-56 pr-2 items-center'>
                                {fileUploaded && (
                                  <span className='w-6 h-6 rounded-full flex justify-center items-center mr-6 bg-content-accent-light-11'>
                                    <CheckIcon width={16} height={16} className='text-content-grey-600' />
                                  </span>
                                )}
                                <ClipboardDocumentIcon width={24} height={24} className='text-content-grey-600' />
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
                          <div className='pt-8 flex flex-col'>
                          <CustomRadiobox  />
                          </div>
                          </>
                        ) : (
                          <div
                            onDrop={(e) => handleDropFiles(e)}
                            onDragOver={handleDragFiles}
                            className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6 bg-white border-2 border-content-accent
                             border-dashed rounded-20'
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
                        )}
                      </div>
                    )}

                    {currentStep === ADDDOCUMENTSSTEPS.Setup && !!file && (
                      <div className='flex flex-col lg:flex-row gap-8 justify-between'>
                        <div className='flex flex-col w-5/12'>
                          <div className='flex gap-3 mb-6'>
                            <span className='w-11 h-11 rounded-full bg-content-accent-light-11 flex justify-center items-center'>
                              <ClipboardDocumentIcon className='text-content-blue-dark' width={20} height={20} />
                            </span>
                            <div className='flex flex-col justify-evenly text-left'>
                              <h5 className='font-poppins-semibold text-content-black text-sm'>{file.name}</h5>
                              <p className='text-content-grey-600 font-normal text-xs leading-5'>
                                {bytesCalculator(file.size)}
                              </p>
                            </div>
                          </div>
                          <div className='flex'>
                            <p className='text-content-grey-600 text-xs leading-5 text-left max-w-md'>
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
                          <h5 className='text-sm font-poppins-semibold text-content-black mb-8 text-left'>
                            Assign a plugin to computer resources
                          </h5>

                          {resources && resources.device_map.cpu && (
                            <div className='flex flex-col gap-3 mb-3'>
                              <div className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'>
                                <CustomCheckbox
                                  active={deviceMapConfig.cpu}
                                  onChange={(check: boolean) => setDeviceMapConfig((prev) => ({...prev, cpu: check}))}
                                  title={`cpu`}
                                  description={resources.device_map.cpu}
                                />
                                <span className='text-content-grey-600 text-xs ml-auto'>{`${resources.memory_free} of ${resources.memory_total}`}</span>
                              </div>
                            </div>
                          )}

                          {/* {setupEnv.map((setup, inx) => (
                            <div key={setup.id} className='flex flex-col gap-3 mb-3'>
                              <div className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'>
                                <CustomCheckbox
                                  active={setup.active}
                                  onChange={(check: boolean) => handleChangeSetup(check, inx)}
                                  title={setup.title}
                                  description={setup.desc}
                                />
                                <span className='text-content-grey-600 text-xs ml-auto'>{setup.space}</span>
                              </div>
                            </div>
                          ))} */}
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
                      {currentStep === ADDDOCUMENTSSTEPS.Upload && (
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
                      {currentStep === ADDDOCUMENTSSTEPS.Setup && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={'primary'}
                          title='Upload document'
                          loading={loading}
                          disabled={loading}
                          onClick={handleSubmitSecondStep}
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
