import React, {Fragment, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Dialog, Transition} from '@headlessui/react';

import {Button} from '../../buttons';

import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import {setUploadSucceeded, uploadNewWaspApp} from '@/app/lib/features/waspApps/waspAppsSlice';
import {useForm} from 'react-hook-form';
import {AppDispatch} from '@/app/lib/store';

import {UPLOADWASPAPPSTEPS} from '@/constant';
import UploadWaspAppModalHeader from './UploadWaspAppModalHeader';
import UploadWaspSelectFileSection from './UploadWaspSelectFileSection';
import WaspAppDialogFormInputs from './WaspAppDialogForm';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export interface IWaspFormInputs {
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
  const [currentStep, setCurrentStep] = useState(UPLOADWASPAPPSTEPS.SelectFile);

  const [instance_type, setInstance_type] = useState<'Shared' | 'Private'>('Shared');
  const [is_enabled, setIs_enabled] = useState(true);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IWaspFormInputs>();

  const handleSubmitFirstStep = () => {
    if (fileIsSelected && file && currentStep === UPLOADWASPAPPSTEPS.SelectFile) {
      setCurrentStep(UPLOADWASPAPPSTEPS.Upload);
    }
  };

  const handleSubmitSecondStep = (data: IWaspFormInputs) => {
    if (fileIsSelected && file && currentStep === UPLOADWASPAPPSTEPS.Upload) {
      const {name, description} = data;
      if (!name || !description) return;
      console.log('submit is running');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('is_enabled', `${is_enabled}`);
      formData.append('instance_type', instance_type);

      dispatch(uploadNewWaspApp(formData));
    }
  };

  const handleGoToPrevStep = () => {
    setCurrentStep(UPLOADWASPAPPSTEPS.SelectFile);
  };

  const handleCloseDialog = () => {
    setInitialFileStarted(false);
    setUploadPercentage(0);
    setFile(null);
    setFileIsSelected(false);
    setCurrentStep(UPLOADWASPAPPSTEPS.SelectFile);
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
    if (currentStep === UPLOADWASPAPPSTEPS.Upload && uploadSucceeded) {
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
                  <UploadWaspAppModalHeader currentStep={currentStep} handleCloseModal={handleCloseDialog} />
                  <div className='flex flex-col flex-auto justify-between '>
                    {currentStep === UPLOADWASPAPPSTEPS.SelectFile && (
                      <UploadWaspSelectFileSection
                        file={file}
                        fileIsSelected={fileIsSelected}
                        initialFileStarted={initialFileStarted}
                        setFile={setFile}
                        uploadPercentage={uploadPercentage}
                      />
                    )}
                    {currentStep === UPLOADWASPAPPSTEPS.Upload && (
                      <WaspAppDialogFormInputs
                        uploadIsLoading={uploadIsLoading}
                        handleSubmitSecondStep={handleSubmitSecondStep}
                        file={file}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        register={register}
                        setIs_enabled={setIs_enabled}
                        is_enabled={is_enabled}
                        setInstance_type={setInstance_type}
                        instance_type={instance_type}
                        handleGoToPrevStep={handleGoToPrevStep}
                      />
                    )}
                    {currentStep === UPLOADWASPAPPSTEPS.SelectFile && (
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
