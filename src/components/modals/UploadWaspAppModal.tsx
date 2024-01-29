import React, {Fragment, useState, useEffect, useRef, ChangeEvent, DragEvent} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Dialog, Transition} from '@headlessui/react';

import {ArrowUpTrayIcon, CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../buttons';
import toast from 'react-hot-toast';
import {bytesCalculator} from '@/helpers';

import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import {setUploadSucceeded, uploadNewWaspApp} from '@/app/lib/features/waspApps/waspAppsSlice';
import {useForm} from 'react-hook-form';
import {Input} from '../input';
import { waspAppFormValidator} from '@/helpers/validators';
import { AppDispatch } from '@/app/lib/store';

const VALIDPLUGINFILE = {Format: '.zip', Type: 'application/zip'};
const UPLOADWASPAPPSTEPS = {Prepare: 1, Upload: 2};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInputs {
  name: string;
  description: string;
}
export const UploadWaspAppModal = ({open, onClose}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {uploadIsLoading, uploadSucceeded} = useSelector(selectWaspApps);

  const [initialFileStarted, setInitialFileStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [currentStep, setCurrentStep] = useState(UPLOADWASPAPPSTEPS.Prepare);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const handleSubmitFirstStep = () => {
    if (fileIsSelected && file && currentStep === UPLOADWASPAPPSTEPS.Prepare) {
      setCurrentStep(UPLOADWASPAPPSTEPS.Upload);
    }
  };

  const handleSubmitSecondStep = (data: IFormInputs) => {
    if (fileIsSelected && file && currentStep === UPLOADWASPAPPSTEPS.Upload) {
      const {name, description} = data;
      if (!name || !description) return;
      console.log('submit is running');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);

      dispatch(uploadNewWaspApp(formData));
    }
  };

  const handleGoToPrevStep = () => {
    setCurrentStep(UPLOADWASPAPPSTEPS.Prepare);
  };
  const handleDragFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleCheckFileIsValid(e.dataTransfer.files[e.dataTransfer.files.length - 1]);
    setFile(e.dataTransfer.files[e.dataTransfer.files.length - 1]);
  };
  const handleCustomSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      console.log({e, file: e.target.files[e.target.files.length - 1]});
      setFile(e.target.files[e.target.files.length - 1]);
      handleCheckFileIsValid(e.target.files[e.target.files.length - 1]);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
  };
  const handleCheckFileIsValid = (file: File) => {
    if (file.type === VALIDPLUGINFILE.Type) {
      setFile(file);
    } else {
      toast.error(
        `An incorrect file has been selected for the selected file. format:${file.name} _ type:${file.type} The expected format is "*.zip" and valid type is "application/zip"`,
      );
    }
  };

  const handleCloseDialog = () => {
    setInitialFileStarted(false);
    setUploadPercentage(0);
    setFile(null);
    setFileIsSelected(false);
    setCurrentStep(UPLOADWASPAPPSTEPS.Prepare);
    dispatch(setUploadSucceeded(false));
    onClose();
  };

  useEffect(() => {
    if (file) {
      setFileIsSelected(true);
      setInitialFileStarted(true);
    } else {
      setFileIsSelected(false);
      setInitialFileStarted(false);
      setUploadPercentage(0);
    }
  }, [file]);

  useEffect(() => {
    if (initialFileStarted) {
      const countdown = () => {
        if (uploadPercentage >= 100) {
          setInitialFileStarted(false);
        } else {
          setUploadPercentage((percent) => ++percent);
        }
      };
      setTimeout(countdown, 5);
    }
  }, [initialFileStarted, uploadPercentage]);

  useEffect(() => {
    if(currentStep === UPLOADWASPAPPSTEPS.Upload && uploadSucceeded) {
      handleCloseDialog();
    }
  }, [uploadSucceeded]);

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
                  className='w-full max-w-md md:max-w-lg lg:max-w-3xl h-[calc(100vh-64px)] max-h-[652px] flex flex-col
                transform border border-content-primary bg-content-grey-100
                 pb-6 pt-7 px-8 md:pb-8 md:pt-9 md:px-12 xl:pb-11 xl:pt-12 xl:px-16 rounded-[20px] align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-16 relative'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-content-black font-poppins-semibold text-left absolute left-0 top 0'
                    >
                      Upload Wasp
                    </Dialog.Title>
                    <div className='flex mx-auto'>
                      <div className='flex text-xs items-center'>
                        <div
                          className={`flex items-center justify-center rounded-20 px-4 mx-1 h-7 ${
                            currentStep >= UPLOADWASPAPPSTEPS.Prepare
                              ? 'bg-content-accent-light-11 text-content-accent-hover font-poppins-semibold'
                              : 'text-content-grey-600 bg-content-white font-poppins-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= UPLOADWASPAPPSTEPS.Prepare ? (
                              '1. Prepare'
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
                            currentStep >= UPLOADWASPAPPSTEPS.Upload
                              ? 'bg-content-accent-light-11 text-content-accent-hover font-poppins-semibold'
                              : 'text-content-grey-600 bg-content-white font-poppins-light'
                          }`}
                        >
                          <span className='flex gap-1'>
                            {currentStep <= UPLOADWASPAPPSTEPS.Upload ? (
                              '2. Upload'
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

                    <IconButton className='absolute top-0 right-1' onClick={handleCloseDialog}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex flex-col flex-auto justify-between '>
                    {currentStep === UPLOADWASPAPPSTEPS.Prepare && (
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
                          <p className='text-xs text-content-grey-600 '>Files in .zip file format only</p>
                          <input
                            type='file'
                            className='hidden'
                            hidden
                            accept='.zip'
                            ref={inputFileRef}
                            onChange={(e) => handleCustomSelectFile(e)}
                          />
                        </div>
                        {fileIsSelected && !!file && (
                          <div className='flex flex-wrap py-3 px-6 bg-content-white rounded-20 w-full items-center justify-between relative'>
                            <div className='flex gap-4 items-center max-w-full'>
                              <div className='flex w-56 pr-2 items-center'>
                                <p className='font-semibold text-xs text-content-black truncate ... max-w-[calc(100%-36px)]'>
                                  {file.name}
                                </p>
                              </div>
                              <span className='text-xs text-content-grey-600 lg:w-24 ml-auto lg:ml-0 text-center'>
                                {bytesCalculator(file.size)}
                              </span>
                            </div>
                            <div className='flex justify-end items-center gap-6'>
                              {initialFileStarted && (
                                <div className='flex items-center gap-2 max-w-full'>
                                  <div className='h-1.5 bg-content-grey-100 dark:bg-neutral-600 w-[140px] '>
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
                    {currentStep === UPLOADWASPAPPSTEPS.Upload && (
                      <form className='flex flex-col flex-1 gap-5 ' onSubmit={handleSubmit(handleSubmitSecondStep)}>
                        <div className='flex flex-col flex-1 w-full gap-5 max-w-lg mx-auto'>
                          {!!file && (
                            <div className='flex gap-4 items-center max-w-full mb-8'>
                              <div className='flex w-full pr-2 items-center'>
                                <p className='font-semibold text-xs text-content-black truncate ... max-w-[calc(100%-36px)]'>
                                  {file.name}
                                </p>
                              </div>
                              <span className='text-xs text-content-grey-600 lg:w-24 ml-auto lg:ml-0 text-center'>
                                {bytesCalculator(file.size)}
                              </span>
                            </div>
                          )}
                          <Input
                            className='h-10'
                            placeholder='App Name'
                            errors={errors.name && errors.name.message}
                            rules={register('name', waspAppFormValidator.name)}
                          />
                          <Input
                            className='h-10'
                            placeholder='App Descriptions'
                            errors={errors.description && errors.description.message}
                            rules={register('description', waspAppFormValidator.description)}
                          />
                        </div>
                        <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1 mt-auto'>
                          <Button
                            className='mt-2 w-1/2 !h-10 border'
                            variant='transparent'
                            title={`Back`}
                            onClick={handleGoToPrevStep}
                            type='button'
                          />
                          <Button
                            className='mt-2 w-1/2 !h-10'
                            variant='primary'
                            disabled={uploadIsLoading}
                            title={!uploadIsLoading ? 'Upload' : ''}
                            loading={uploadIsLoading}
                            type='submit'
                          />
                        </div>
                      </form>
                    )}
                    {currentStep === UPLOADWASPAPPSTEPS.Prepare && (
                      <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1'>
                        <Button
                          type='button'
                          className='flex-1 !h-11'
                          variant='outline'
                          title='Cancel'
                          onClick={handleCloseDialog}
                        />
                        {!uploadSucceeded && (
                          <Button
                            type='button'
                            className='flex-1 !h-11'
                            variant={'primary'}
                            title={!uploadIsLoading ? 'Continue' : ''}
                            loading={uploadIsLoading}
                            disabled={!fileIsSelected || uploadIsLoading}
                            onClick={handleSubmitFirstStep}
                          />
                        )}
                      </div>
                    )}
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
