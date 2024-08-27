import {Fragment} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '../buttons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  srcDoc: string;
}

export const IframeWithSrcDocDialog = ({open, onClose, srcDoc}: ModalProps) => {
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
                  className='w-full h-full relative transform border border-content-primary bg-grey-100 p-6 rounded-xl align-middle shadow-xl transition-all'
                >
                  <IconButton className='absolute top-4 right-4' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                  <iframe
                    style={{
                      height: 'calc(100vh - 108px)',
                      width: 'calc(100vw - 108px)',
                    }}
                    className={`w-full h-full bg-red text-grey-0 [&_body]:m-0 flex-1`}
                    srcDoc={srcDoc}
                    allow='clipboard-read; clipboard-write'
                  ></iframe>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
