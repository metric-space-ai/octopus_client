import React, {Fragment, useState, useEffect, useRef, LegacyRef, RefObject, ChangeEvent, DragEvent} from 'react';

import {Dialog, Listbox, Transition} from '@headlessui/react';

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
import {MarkdownContent} from '../markdown';
import Highlight from 'react-highlight';

const VALIDPLUGINFILE = {Format: '.py', Type: 'text/x-python'};
const ADDPLUGINSTEPS = {Upload: 1, Setup: 2, Installation: 3};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInputs {
  name: string;
  id: number;
}

export const UploadPluginModal = ({open, onClose}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File>();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(ADDPLUGINSTEPS.Upload);
  const [fileText, setFileText] = useState('');

  const [active, setActive] = useState(false);
  const [setupFormIsValid, setSetupFormIsValid] = useState(false);

  const [installStarted, setInstallStarted] = useState(false);
  const [installPercentage, setInstallPercentage] = useState(0);
  const [pluginInstalled, setPluginInstalled] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const handleSubmitSecondStep = async () => {
    if (fileUploaded && currentStep === ADDPLUGINSTEPS.Setup) {
      setLoading(true);
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function (e) {
        const rawLog = reader.result;
        console.log({rawLog});
        if (typeof rawLog === 'string') {
          setFileText(rawLog);
        }
        setCurrentStep(ADDPLUGINSTEPS.Installation);
        setInstallStarted(true);
      };

      setLoading(false);
    }
  };

  const handleSubmitFirstStep = async () => {
    if (fileUploaded && currentStep === ADDPLUGINSTEPS.Upload) {
      setLoading(true);
      setCurrentStep(ADDPLUGINSTEPS.Setup);
      setLoading(false);
    }
  };
  const onSubmit = async (data: IFormInputs) => {
    const {name, id} = data;
    console.log({name, id});
  };

  const handleDragFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log({files: e.dataTransfer.files[0]});
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
    setFileText('');
    setActive(false);
    setSetupFormIsValid(false);
    setInstallStarted(false);
    setInstallPercentage(0);
    setPluginInstalled(false);
    onClose();
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
        if (installPercentage >= 100) {
          setPluginInstalled(true);
          console.log(`uploaded`);
          setInstallStarted(false);
        } else {
          setInstallPercentage((percent) => ++percent);
        }
      };
      setTimeout(countdown, 10);
    }
  }, [installStarted, installPercentage]);

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

  useEffect(() => {
    console.log({fileText});
  }, [fileText]);

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
                      Upload
                    </Dialog.Title>
                    <div className='flex mx-auto'>
                      <div className='flex text-xs items-center'>
                        <div
                          className={`flex items-center justify-center rounded-20 px-4 mx-1 h-7 ${
                            currentStep >= ADDPLUGINSTEPS.Upload
                              ? 'bg-content-accent-light-11 text-content-accent-hover font-poppins-semibold'
                              : 'text-content-grey-600 bg-content-white font-poppins-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= ADDPLUGINSTEPS.Upload ? (
                              '1. Upload'
                            ) : (
                              <>
                                <CheckIcon width={16} height={16} />
                                Done
                              </>
                            )}
                          </span>
                        </div>
                        <span className='w-6 h-1px bg-content-accent-100' />
                        <div
                          className={`flex items-center justify-center rounded-20 px-4 mx-1 h-7 ${
                            currentStep >= ADDPLUGINSTEPS.Setup
                              ? 'bg-content-accent-light-11 text-content-accent-hover font-poppins-semibold'
                              : 'text-content-grey-600 bg-content-white font-poppins-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= ADDPLUGINSTEPS.Setup ? (
                              '2. Setup'
                            ) : (
                              <>
                                <CheckIcon width={16} height={16} />
                                Done
                              </>
                            )}
                          </span>
                        </div>
                        <span className='w-6 h-1px bg-content-accent-100' />
                        <div
                          className={`flex items-center justify-center rounded-20 px-4 mx-1 h-7 ${
                            currentStep >= ADDPLUGINSTEPS.Installation
                              ? 'bg-content-accent-light-11 text-content-accent-hover font-poppins-semibold'
                              : 'text-content-grey-600 bg-content-white font-poppins-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= ADDPLUGINSTEPS.Installation ? (
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
                        fileUploaded && currentStep === ADDPLUGINSTEPS.Upload
                          ? handleSubmitFirstStep
                          : handleSubmit(onSubmit)
                      }
                    > */}
                    {currentStep === ADDPLUGINSTEPS.Upload && (
                      <div className=' flex flex-col '>
                        <div
                          onDrop={(e) => handleDropFiles(e)}
                          onDragOver={handleDragFiles}
                          className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6
                        bg-white border-2 border-content-accent border-dashed rounded-20 '
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
                        {fileIsSelected && !!file && (
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
                        )}
                      </div>
                    )}

                    {currentStep === ADDPLUGINSTEPS.Setup && !!file && (
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
                          <div className='flex flex-col gap-3 mb-3'>
                            <div className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'>
                              <CustomCheckbox
                                active={active}
                                onChange={(check: boolean) => setActive(check)}
                                title='CPU'
                                description='Intel Core i7-13700K'
                              />
                              <span className='text-content-grey-600 text-xs ml-auto'>8GB of 16GB</span>
                            </div>
                          </div>
                          <div className='flex flex-col gap-3 mb-3'>
                            <div className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'>
                              <CustomCheckbox
                                active={active}
                                onChange={(check: boolean) => setActive(check)}
                                title='GPU (Discrete)'
                                description='NVIDIA GeForce MX250'
                              />
                              <span className='text-content-grey-600 text-xs ml-auto'>9GB of 11GB</span>
                            </div>
                          </div>
                          <div className='flex flex-col gap-3 mb-3'>
                            <div className='w-full flex bg-white rounded-[40px] px-6 py-3 h-45-px items-center'>
                              <CustomCheckbox
                                active={active}
                                onChange={(check: boolean) => setActive(check)}
                                title='GPU (Integrated)'
                                description='Intel UHD Graphics'
                              />
                              <span className='text-content-grey-600 text-xs ml-auto'>0.7GB of 2GB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === ADDPLUGINSTEPS.Installation && fileText && (
                      <div className='flex flex-col flex-auto'>
                        <div className='flex flex-col mb-6'>
                          <div className='flex justify-between mb-3'>
                            <p className='text-content-grey-900 text-sm'>The plugin is installing, please wait</p>
                            <span className='text-content-black text-xs font-poppins-medium tracking-[-1px] flex items-center'>
                              {`${installPercentage} %`}
                            </span>
                          </div>
                          <div className='h-1.5 bg-content-white dark:bg-neutral-600 w-full '>
                            <div
                              className='h-1.5 bg-content-accent transition-all'
                              style={{width: `${installPercentage}%`}}
                            ></div>
                          </div>
                        </div>
                        <div className='w-full flex-auto py-4 px-5 overflow-auto bg-content-black text-left rounded-20 max-h-[342px] custom-scrollbar-thumb'>
                          <Highlight innerHTML={false} className='text-content-white [&_.hljs-keyword]:text-content-blue-light [&_.hljs-string]:text-content-green [&_.hljs-selector-class]:text-content-red-400
                           [&_.hljs-attribute]:text-yellow-300'>
                            {fileText}
                          </Highlight>
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
                      {currentStep === ADDPLUGINSTEPS.Upload && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={fileUploaded ? 'primary' : 'disabled'}
                          title='Continue'
                          loading={loading}
                          disabled={!fileUploaded}
                          onClick={handleSubmitFirstStep}
                        />
                      )}
                      {currentStep === ADDPLUGINSTEPS.Setup && (
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant={active ? 'primary' : 'disabled'}
                          title='Continue'
                          loading={loading}
                          disabled={!active}
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
                          disabled={!pluginInstalled}
                          onClick={handleCloseModal}
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
