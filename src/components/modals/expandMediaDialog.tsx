import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '../buttons';
import {IChatMessageFile} from '@/types';
import {ImagesBaseUrl} from '@/constant';
import Image from 'next/image';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  media: IChatMessageFile;
  title?: string;
  width?: number;
  height?: number;
}

export const ExpandMediaDialog = ({open, onClose, media, title, width = 400, height = 400}: ModalProps) => {
  const [loaded, setLoaded] = useState(true);

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
            <div className='flex items-center justify-center p-4 text-center'>
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
                  style={{
                    minHeight: 'calc(100vh - 60px)',
                    minWidth: 'calc(100vw - 60px)',
                  }}
                  className='w-full h-full flex items-center relative transform border border-content-primary bg-content-grey-100 p-6 rounded-[20px] align-middle shadow-xl transition-all'
                >
                  <IconButton className='absolute top-4 right-4' onClick={onClose}>
                    <XMarkIcon className='w-8 h-8 text-content-primary' />
                  </IconButton>

                  {media.media_type.includes('image') && (
                    <>
                      <img
                        src={`${ImagesBaseUrl}${media.file_name}`}
                        alt={title ?? ''}
                        width={width}
                        height={height}
                        className='rounded-4 w-full h-full'
                      />
                      {/* {!loaded && (
                        <div
                          className={`mx-2 bg-gray-300 rounded-4 dark:bg-gray-600 absolute left-0 animate-pulse`}
                          style={{width, height}}
                        ></div>
                      )} */}
                    </>
                  )}
                  {media.media_type.includes('video') && (
                    <div>
                      <video width={width} className='w-full' controls>
                        <source src={`${ImagesBaseUrl}${media.file_name}`} type={media.media_type} />
                      </video>
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
