import {Button} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {getWaspAppLogsSourceDocByChatIdAndWaspIdApi} from '@/services/settings.service';
import {IWaspApp} from '@/types';
import {Dialog, Transition} from '@headlessui/react';
import {isAxiosError} from 'axios';
import classNames from 'classnames';
import React, {Fragment, useEffect, useState} from 'react';
import Highlight from 'react-highlight';
import toast from 'react-hot-toast';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  waspApp: IWaspApp | undefined;
  waspAppId: string;
  messageId: string;
}

const WaspAppGetLogsDialog = ({isOpen, onClose, waspApp, waspAppId, messageId}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState('');

  const handleClose = () => {
    onClose();
  };

  const handleGetWaspAppLogs = async () => {
    setIsLoading(true);
    try {
      const {data, status} = await getWaspAppLogsSourceDocByChatIdAndWaspIdApi({id: messageId, wasp_app_id: waspAppId});
      if (status === 200) {
        setLogs(data);
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.error ?? error.message);
      } else {
        toast.error(error.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (waspAppId && messageId && isOpen) {
      console.log('handleGetWaspAppLogs(waspApp);...');
      handleGetWaspAppLogs();
    }
  }, [isOpen]);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/25' />
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
              <Dialog.Panel className='w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 mb-2'>
                  Wasp App Logs
                </Dialog.Title>
                <div className='flex flex-col justify-between flex-1 gap-6 overflow-hidden'>
                  <div
                    className={classNames(
                      'min-h-[240px] bg-grey-900 text-grey-0 p-1 flex flex-1 max-w-full',
                      isLoading && 'items-center justify-center',
                      !isLoading && 'text-left flex-col',
                      '[&_pre]:flex-1',
                    )}
                    style={{direction: 'rtl'}}
                  >
                    {isLoading && !logs ? (
                      <Spinner size='medium' />
                    ) : (
                      <span style={{direction: 'ltr'}}>
                        <Highlight
                          innerHTML={false}
                          className='text-grey-0 [&_.hljs-keyword]:text-secondary-600 [&_.hljs-string]:text-secondary [&_.hljs-selector-class]:text-danger-300
                           [&_.hljs-attribute]:text-yellow-300 [&_.hljs-comment]:text-grey-400 [&_.hljs-comment]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500 
                           [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500 max-h-[420px] custom-scrollbar-thumb'
                        >
                          {logs ? logs : 'No Logs Were Found To Display'}
                        </Highlight>
                      </span>
                    )}
                  </div>

                  <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1 h-11'>
                    <Button
                      type='button'
                      className='flex-1 !h-11'
                      variant='outline'
                      title='close'
                      onClick={handleClose}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WaspAppGetLogsDialog;
