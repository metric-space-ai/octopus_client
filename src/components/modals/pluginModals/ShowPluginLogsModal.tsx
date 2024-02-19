import React, {Fragment, useEffect} from 'react';

import {Dialog, Transition} from '@headlessui/react';

import {XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../../buttons';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/app/lib/store';
import {IPlugin} from '@/types';
import {getServiceLogsByPluginId} from '@/app/lib/features/aiServices/aiServicesSlice';
import Highlight from 'react-highlight';
import classNames from 'classnames';
import {Spinner} from '@/components/spinner';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  plugin: IPlugin;
  isLoading: boolean;
}

export const ShowPluginLogsModal = ({open, onClose, plugin, isLoading}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseModal = () => {
    // setLoading(false);
    onClose();
  };

  useEffect(() => {
    dispatch(getServiceLogsByPluginId(plugin.id));
  }, []);

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
                      Plugin Logs
                    </Dialog.Title>

                    <IconButton className='absolute top-0 right-1' onClick={handleCloseModal}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex flex-col justify-between flex-1'>
                    <div
                      className={classNames(
                        'h-[420px] max-h-full custom-scrollbar-thumb bg-content-black text-content-white p-1',
                        isLoading && 'flex items-center justify-center',
                        !isLoading && ' text-left',
                      )}
                    >
                      {isLoading ? (
                        <Spinner size='medium' />
                      ) : (
                        <Highlight
                          innerHTML={false}
                          className='text-content-white [&_.hljs-keyword]:text-content-blue-light [&_.hljs-string]:text-content-green [&_.hljs-selector-class]:text-content-red-400
                           [&_.hljs-attribute]:text-yellow-300 [&_.hljs-comment]:text-content-grey-400 [&_.hljs-comment]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500 
                           [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500 custom-scrollbar-thumb'
                        >
                          {plugin.logs ? plugin.logs : 'No Logs Were Found To Display'}
                        </Highlight>
                      )}
                    </div>

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
