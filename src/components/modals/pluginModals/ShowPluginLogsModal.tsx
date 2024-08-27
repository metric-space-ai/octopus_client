/* eslint-disable react-hooks/exhaustive-deps */
import React, {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {useDispatch} from 'react-redux';

import {getServiceLogsByPluginId} from '@/app/lib/features/aiServices/aiServicesSlice';
import {AppDispatch} from '@/app/lib/store';
import {Spinner} from '@/components/spinner';
import {IPlugin} from '@/types';

// import Highlight from 'react-highlight';
import {Button, IconButton} from '../../buttons';

const DynamicMarkdownContent = dynamic(async () => (await import('@/components/markdown')).MarkdownContent, {
  loading: () => <div className='w-full flex items-center justify-center h-full bg-grey-150 animate-pulse' />,
});

interface ModalProps {
  open: boolean;
  onClose: () => void;
  plugin: IPlugin;
}

export const ShowPluginLogsModal = ({open, onClose, plugin}: ModalProps) => {
  const [logs, setLogs] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleCloseModal = () => {
    onClose();
  };

  const getPluginLogs = async () => {
    setIsLoading(true);
    try {
      const {
        meta: {requestStatus},
        payload,
      } = await dispatch(getServiceLogsByPluginId(plugin.id));
      if (requestStatus === 'fulfilled' && typeof payload === 'string') {
        setLogs(payload);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!logs && open) getPluginLogs();
    if (!open) setLogs('');
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
                  className='w-full max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-modal-xxl h-[calc(100vh-64px)] max-h-[652px] flex flex-col
                transform border border-content-primary bg-grey-100
                 pb-6 pt-7 px-8 md:pb-8 md:pt-9 md:px-12 xl:pb-11 xl:pt-12 xl:px-16 rounded-xl align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-16 relative'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-grey-900 text-left absolute left-0 top 0'
                    >
                      Plugin Logs
                    </Dialog.Title>

                    <IconButton className='absolute top-0 right-1' onClick={handleCloseModal}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex flex-col justify-between flex-1 gap-6 overflow-hidden'>
                    {isLoading && !logs ? (
                      <div className='w-full h-full flex justify-center items-center'>
                        <Spinner size='medium' />
                      </div>
                    ) : (
                      <div
                        className={classNames(
                          'max-h-full custom-scrollbar-thumb bg-grey-900 text-grey-0 p-1 flex-1 block',
                          isLoading && 'flex items-center justify-center',
                          !isLoading && ' flex text-left',
                          '[&_pre]:flex-1',
                        )}
                      >
                        <DynamicMarkdownContent
                          className='bg-grey-900 text-success [&_p]:whitespace-nowrap'
                          content={logs ? logs : 'No Logs Were Found To Display'}
                        />
                      </div>
                    )}

                    <div className='flex gap-4 px-4 md:px-8 lg:px-12 xl:px-20 mx-1 h-11'>
                      <Button
                        type='button'
                        className='flex-1 !h-11'
                        variant='outline'
                        title='close'
                        onClick={handleCloseModal}
                      />
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
