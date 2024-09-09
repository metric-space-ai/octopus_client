import React, {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {isAxiosError} from 'axios';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Spinner} from '@/components/spinner';
import {getWaspAppLogsSourceDocByChatIdAndWaspIdApi} from '@/services/settings.service';

const DynamicMarkdownContent = dynamic(async () => (await import('@/components/markdown')).MarkdownContent, {
  ssr: false,
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  waspAppId: string;
  messageId: string;
}

const WaspAppGetLogsDialog = ({isOpen, onClose, waspAppId, messageId}: ModalProps) => {
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
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.error ?? error.message);
      } else {
        toast.error('Something went wrong. Please try again.');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                      'min-h-[240px] max-h-[60vh] p-1 flex flex-1 max-w-full custom-scrollbar-thumb bg-grey-900 overflow-auto',
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
                        <DynamicMarkdownContent
                          className='bg-grey-900 text-white [&_p]:whitespace-nowrap'
                          content={logs ? logs : 'No Logs Were Found To Display'}
                        />
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
