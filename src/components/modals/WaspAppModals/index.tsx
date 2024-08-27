import React, {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {AxiosError} from 'axios';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';

import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import {fullUpdateWaspApp, setUploadSucceeded, uploadNewWaspApp} from '@/app/lib/features/waspApps/waspAppsSlice';
import {AppDispatch} from '@/app/lib/store';
import {UPLOADWASPAPPSTEPS} from '@/constant';
import {extractMetaUploadNewWaspAppApi} from '@/services/settings.service';
import {EWaspInstanceType, IWaspApp} from '@/types';

import UploadWaspAppModalHeader from './UploadWaspAppModalHeader';
import UploadWaspSelectFileSection from './UploadWaspSelectFileSection';
import WaspAppDialogFormInputs from './WaspAppDialogForm';
import {Button} from '../../buttons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  selectedWasp?: IWaspApp | null;
}

export interface IWaspFormInputs {
  name: string;
  description: string;
}
export const UploadWaspAppModal = ({open, onClose, selectedWasp}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {uploadIsLoading, uploadSucceeded} = useSelector(selectWaspApps);

  const [initialFileStarted, setInitialFileStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [extractMetaIsLoading, setExtractMetaIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(UPLOADWASPAPPSTEPS.SelectFile);

  const [instanceType, setInstanceType] = useState<EWaspInstanceType>(EWaspInstanceType.User);
  const [is_enabled, setIs_enabled] = useState(true);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IWaspFormInputs>();

  const handleSubmitFirstStep = async () => {
    if (fileIsSelected && file && currentStep === UPLOADWASPAPPSTEPS.SelectFile) {
      setExtractMetaIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const {status, data} = await extractMetaUploadNewWaspAppApi(formData);
        if (status === 201) {
          const {description, title} = data;
          setValue('name', title);
          setValue('description', description);

          setCurrentStep(UPLOADWASPAPPSTEPS.Upload);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err?.response?.data.error);
        }
      } finally {
        setExtractMetaIsLoading(false);
      }
    }
  };

  const handleSubmitSecondStep = (data: IWaspFormInputs) => {
    if (((fileIsSelected && file) || selectedWasp) && currentStep === UPLOADWASPAPPSTEPS.Upload) {
      const {name, description} = data;
      if (!name || !description) return;
      console.log('submit is running');
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('is_enabled', `${is_enabled}`);
      formData.append('instance_type', instanceType);

      if (selectedWasp) {
        dispatch(fullUpdateWaspApp({formData, id: selectedWasp.id}));
      } else {
        dispatch(uploadNewWaspApp(formData));
      }
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
    console.log('check closing');
    if (currentStep === UPLOADWASPAPPSTEPS.Upload && uploadSucceeded) {
      console.log('check closing... run');
      handleCloseDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadSucceeded]);
  useEffect(() => {
    if (open && selectedWasp) {
      const {description = '', name = '', is_enabled, instance_type} = selectedWasp;
      reset({
        description,
        name,
      });
      setIs_enabled(is_enabled);
      setInstanceType(instance_type);
      setCurrentStep(UPLOADWASPAPPSTEPS.Upload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
                  className='w-full max-w-md md:max-w-lg lg:max-w-3xl h-[calc(100vh-64px)] max-h-[652px] flex flex-col
                transform border border-content-primary bg-grey-100
                 pb-6 pt-7 px-8 md:pb-8 md:pt-9 md:px-12 xl:pb-11 xl:pt-12 xl:px-16 rounded-xl align-middle shadow-xl transition-all'
                >
                  <UploadWaspAppModalHeader
                    currentStep={currentStep}
                    handleCloseModal={handleCloseDialog}
                    updateMode={!!selectedWasp}
                  />
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
                        setInstanceType={setInstanceType}
                        instance_type={instanceType}
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
                            title={extractMetaIsLoading ? '' : 'Continue'}
                            loading={extractMetaIsLoading}
                            disabled={!fileIsSelected || extractMetaIsLoading}
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
