import React, {ChangeEvent, DragEvent, Fragment, useEffect, useRef, useState} from 'react';

import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {
  ArrowUpTrayIcon,
  CheckIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {isAxiosError} from 'axios';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';

import {getAllPlugins} from '@/app/lib/features/aiServices/aiServicesSlice';
import {createNewFile, getAllFiles} from '@/app/lib/features/files/filesSlice';
import {AppDispatch} from '@/app/lib/store';
import {Button, IconButton} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {bytesCalculator} from '@/helpers';
import {pdfToMarkdownApi} from '@/services/settings.service';
import {IPlugin} from '@/types';

const DynamicMarkdownContent = dynamic(async () => (await import('@/components/markdown')).MarkdownContent, {
  ssr: false,
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});

const ADDDOCUMENTSSTEPS = {SelecFile: 1, CreateMarkdown: 2, Uploaded: 3};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateMarkdownModalDialog = ({open, onClose}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(false);
  const [checkAvailabilityIsLoading, setCheckAvailabilityIsLoading] = useState(false);
  const [serviceIsAvailable, setServiceIsAvailable] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadStarted, setUploadStarted] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [file, setFile] = useState<File>();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [pdfContent, setPdfContent] = useState<{
    markdown: string;
    summary: string;
  }>();
  const [currentStep, setCurrentStep] = useState(ADDDOCUMENTSSTEPS.SelecFile);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleCreateDocument = async () => {
    if (!pdfContent) {
      toast.error('PDF content is not available.');
      return;
    }

    setLoading(true);

    try {
      // Convert pdfContent to a JSON string
      const jsonString = JSON.stringify(pdfContent);

      // Create a Blob from the JSON string
      const jsonBlob = new Blob([jsonString], {type: 'application/json'});

      // Create FormData and append the JSON Blob as a file
      const formData = new FormData();
      formData.append('file', jsonBlob, `${file?.name}.json`); // Name the file 'pdfContent.json'

      // Make the API request to upload the file
      const {
        meta: {requestStatus},
      } = await dispatch(createNewFile(formData));
      // const {status} = await createNewNextCloudDocumentsApi(formData);

      if (requestStatus === 'fulfilled') {
        toast.success('upload successfull');
        setCurrentStep(ADDDOCUMENTSSTEPS.Uploaded);
        dispatch(getAllFiles());
        handleCloseModal();
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    handleClearStates();
  };
  const handleFileChange = () => {
    if (fileUploaded && file && currentStep === ADDDOCUMENTSSTEPS.SelecFile) {
      if (file) {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).replace('data:', '').replace(/^.+,/, '');
          console.log({base64String});
          handleSubmitFirstStep(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const handleSubmitFirstStep = async (base64String: string) => {
    setLoading(true);

    try {
      const {status, data} = await pdfToMarkdownApi(base64String);
      console.log({status, data});
      if (data.Error) {
        const parsedError: {error: string} = JSON.parse(data.Error.error);
        toast.error(parsedError.error);
      } else if (data.Mixed && data.Mixed.length > 0) {
        const {Text} = data.Mixed[0];
        if (!Text?.response) return;
        const parsedData: {
          markdown: string;
          summary: string;
        } = JSON.parse(Text.response);
        setPdfContent(parsedData);
        setCurrentStep(ADDDOCUMENTSSTEPS.CreateMarkdown);
        console.log({response: Text.response});
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDragFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const {files} = e.dataTransfer;
    handleCheckFileIsValid(files[files.length - 1]);
  };
  const handleCustomSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const {files} = e.target;
      handleCheckFileIsValid(files[files.length - 1]);
    }
  };

  const handleDeleteFile = () => {
    setFile(undefined);
  };
  const handleCheckFileIsValid = (file: File) => {
    // Check if the selected file is a PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file to proceed.');
      return;
    }

    // If the file is a PDF, set the file state
    setFile(file);
  };

  const handleClearStates = () => {
    setUploadStarted(false);
    setUploadPercentage(0);
    setFile(undefined);
    setFileIsSelected(false);
    setFileUploaded(false);
    setCurrentStep(ADDDOCUMENTSSTEPS.SelecFile);
    setLoading(false);
  };
  const handleCloseModal = () => {
    handleClearStates();
    onClose();
  };

  const checkServiceDirectlyIsAvailable = async () => {
    setCheckAvailabilityIsLoading(true);
    try {
      const {payload, meta} = await dispatch(getAllPlugins());
      if (meta.requestStatus === 'fulfilled') {
        if (payload) {
          const allServices: IPlugin[] = payload as IPlugin[];
          if (!!allServices && allServices.length > 0) {
            console.log({allServices});
            const service = allServices.find((elem) => elem.original_file_name.includes('pdf2md'));
            if (service) {
              const {is_enabled, status} = service;
              switch (status) {
                case 'Running':
                  setServiceIsAvailable(true);
                  if (!is_enabled) {
                    setMessage('The Service Is not Enabled');
                  }
                  break;
                case 'Stopped':
                  setMessage('The service is currently stopped.');
                  setServiceIsAvailable(false);
                  break;
                case 'InstallationStarted':
                case 'InstallationFinished':
                case 'ParsingStarted':
                case 'ParsingFinished':
                  setMessage('The service installation is in progress.');
                  setServiceIsAvailable(false);
                  break;
                case 'Error':
                  setMessage('There was an error with the service.');
                  setServiceIsAvailable(false);
                  break;
                default:
                  // setMessage('The service is in an unknown state.');
                  setServiceIsAvailable(false);
                  break;
              }
            } else {
              await checkServiceIsAvailable();
            }
          }
        }
      }
    } finally {
      setCheckAvailabilityIsLoading(false);
    }
  };
  const checkServiceIsAvailable = async () => {
    try {
      const {status, data} = await pdfToMarkdownApi('');
      console.log({status, data});
      setServiceIsAvailable(true);
    } catch (error) {
      if (isAxiosError(error) && [error.status, error.response?.status].includes(404)) {
        toast.error('The service is temporarily unavailable, possibly due to ongoing updates.');
        setServiceIsAvailable(false);
      } else {
        setServiceIsAvailable(true);
      }
    } finally {
      setCheckAvailabilityIsLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      checkServiceDirectlyIsAvailable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
                 pb-5 pt-7 px-8 md:pb-7 md:pt-9 md:px-12 xl:pb-9 xl:pt-12 xl:px-16 rounded-xl align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-16 relative'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-grey-900 text-left capitalize'
                      onClick={() => console.log({pdfContent})}
                    >
                      convert pdf to markdown
                    </Dialog.Title>

                    <IconButton className='absolute top-0 right-1' onClick={handleCloseModal}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  {checkAvailabilityIsLoading && (
                    <div className='w-full min-h-[360px] flex flex-col items-center justify-center p-6 gap-6'>
                      <h1 className='text-primary-medium text-xl font-semibold'>
                        Checking if the Service is Available...
                      </h1>
                      <Spinner size='medium' />
                    </div>
                  )}
                  {!serviceIsAvailable && !checkAvailabilityIsLoading && (
                    <div className='w-full min-h-[360px] flex flex-col items-center justify-center p-6 gap-6'>
                      <ExclamationTriangleIcon className='w-9 h-9 text-danger-500/90' />
                      <h1 className='text-primary-medium text-xl font-semibold'>
                        {message ?? 'The service is temporarily unavailable due to ongoing updates or maintenance.'}
                        <br />
                        {'If the issue persists, please contact the administrator for assistance.'}
                      </h1>
                    </div>
                  )}
                  {!checkAvailabilityIsLoading && serviceIsAvailable && (
                    <div className='flex flex-col flex-auto justify-between '>
                      {currentStep === ADDDOCUMENTSSTEPS.SelecFile && (
                        <div className=' flex flex-col '>
                          {fileIsSelected && !!file ? (
                            <>
                              <div className='flex flex-wrap py-3 px-8 bg-grey-0 rounded-xl w-full items-center justify-between relative'>
                                <div className='flex gap-4 items-center max-w-full'>
                                  <div className='flex w-56 pr-2 items-center'>
                                    {fileUploaded && (
                                      <span className='w-6 h-6 rounded-full flex justify-center items-center mr-6 bg-primary-400/10'>
                                        <CheckIcon width={16} height={16} className='text-grey-600' />
                                      </span>
                                    )}
                                    <ClipboardDocumentIcon width={24} height={24} className='text-grey-600' />
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
                            </>
                          ) : (
                            <div
                              onDrop={(e) => handleDropFiles(e)}
                              onDragOver={handleDragFiles}
                              className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6 bg-grey-0 border-2 border-primary
                             border-dashed rounded-xl'
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

                      {currentStep === ADDDOCUMENTSSTEPS.CreateMarkdown && !!file && (
                        <>
                          {/* <div className='flex flex-col lg:flex-row gap-8 justify-between mb-6'>
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
                            <p
                              className='text-grey-600 text-xs leading-5 text-left max-w-md flex items-center'
                              onClick={() => console.log({pdfContent})}
                            >
                              <CheckIcon className='inline-block w-5 h-5 text-secondary mr-1' />
                              File Is Uploaded
                            </p>
                          </div>
                        </div> */}
                          {pdfContent && (
                            <div className='flex flex-col flex-1 gap-2 p-1 max-h-[420px] custom-scrollbar-thumb mb-2'>
                              <Disclosure>
                                {({open}) => (
                                  <>
                                    <Disclosure.Button
                                      className={
                                        'w-full flex justify-between items-center rounded-2xl text-primary dark:text-grey-50 bg-primary-150/10 dark:bg-grey-600 px-6 py-4'
                                      }
                                    >
                                      <h2 className='text-lg font-semibold capitalize'>pdf content</h2>
                                      <ChevronUpIcon
                                        className={classNames('h-5 w-5', open && 'rotate-180 transform')}
                                      />
                                    </Disclosure.Button>
                                    <Transition
                                      enter='transition duration-100 ease-out'
                                      enterFrom='transform scale-95 opacity-0'
                                      enterTo='transform scale-100 opacity-100'
                                      leave='transition duration-75 ease-out'
                                      leaveFrom='transform scale-100 opacity-100'
                                      leaveTo='transform scale-95 opacity-0'
                                    >
                                      <Disclosure.Panel
                                        className={'w-full p-1 rounded-md bg-primary-150/10 dark:bg-grey-600/80'}
                                      >
                                        <div
                                          className={classNames(
                                            'min-h-[240px] max-h-[280px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb ',
                                            '[&_pre]:flex-1',
                                          )}
                                          style={{direction: 'rtl'}}
                                        >
                                          <span style={{direction: 'ltr'}}>
                                            <DynamicMarkdownContent content={pdfContent.markdown} />
                                          </span>
                                        </div>
                                      </Disclosure.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Disclosure>
                              <Disclosure>
                                {({open}) => (
                                  <>
                                    <Disclosure.Button
                                      className={
                                        'w-full flex justify-between items-center rounded-2xl text-primary dark:text-grey-50 bg-primary-150/10 dark:bg-grey-600 px-6 py-4'
                                      }
                                    >
                                      <h2 className='text-lg font-semibold'>summary</h2>
                                      <ChevronUpIcon
                                        className={classNames('h-5 w-5', open && 'rotate-180 transform')}
                                      />
                                    </Disclosure.Button>
                                    <Transition
                                      enter='transition duration-100 ease-out'
                                      enterFrom='transform scale-95 opacity-0'
                                      enterTo='transform scale-100 opacity-100'
                                      leave='transition duration-75 ease-out'
                                      leaveFrom='transform scale-100 opacity-100'
                                      leaveTo='transform scale-95 opacity-0'
                                    >
                                      <Disclosure.Panel
                                        className={'w-full p-1 rounded-md bg-primary-150/10 dark:bg-grey-600/80'}
                                      >
                                        <div
                                          className={classNames(
                                            'min-h-[240px] max-h-[280px] p-1 flex flex-1 max-w-full text-left flex-col custom-scrollbar-thumb ',
                                            '[&_pre]:flex-1',
                                          )}
                                          style={{direction: 'rtl'}}
                                        >
                                          <span style={{direction: 'ltr'}}>
                                            <DynamicMarkdownContent content={pdfContent.summary} />
                                          </span>
                                        </div>
                                      </Disclosure.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Disclosure>
                            </div>
                          )}
                        </>
                      )}

                      <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1'>
                        {currentStep === ADDDOCUMENTSSTEPS.SelecFile && (
                          <>
                            <Button
                              type='button'
                              className='flex-1 !h-11'
                              variant='outline'
                              title='Cancel'
                              onClick={handleCloseModal}
                              disabled={loading}
                            />
                            <Button
                              type='button'
                              className='flex-1 !h-11'
                              variant={fileUploaded ? 'primary' : 'disabled'}
                              title={!loading ? 'Continue' : ''}
                              loading={loading}
                              disabled={loading || !fileUploaded}
                              onClick={handleFileChange}
                            />
                          </>
                        )}
                        {currentStep === ADDDOCUMENTSSTEPS.CreateMarkdown && (
                          <>
                            <Button
                              type='button'
                              className='flex-1 !h-11'
                              variant={'primary'}
                              title='Back'
                              loading={loading}
                              disabled={loading}
                              onClick={handleBack}
                            />
                            <Button
                              type='button'
                              className='flex-1 !h-11'
                              variant={fileUploaded ? 'primary' : 'disabled'}
                              title={!loading ? 'Create Document' : ''}
                              loading={loading}
                              disabled={loading || !fileUploaded}
                              onClick={handleCreateDocument}
                            />
                          </>
                        )}
                        {currentStep === ADDDOCUMENTSSTEPS.Uploaded && (
                          <Button
                            type='button'
                            className='flex-1 !h-11'
                            variant={'primary'}
                            title='Close Dialog'
                            loading={loading}
                            disabled={loading}
                            onClick={handleCloseModal}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
