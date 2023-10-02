import {Fragment} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '../buttons';

interface ModalProps {
  imageURL: string;
  open: boolean;
  onClose: () => void;
}

export const UserImageModal = ({imageURL = '', onClose, open}: ModalProps) => {
  return (
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
          <div className='flex min-h-full items-center justify-center p-4'>
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
                className={`w-screen h-screen max-w-[380px] max-h-[400px] flex flex-col transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] shadow-xl transition-all gap-3 
               relative`}
                style={{backgroundImage: `url(${imageURL})`}}
              >
                <Dialog.Title as='h3' className='text-2xl font-semibold text-content-black hidden'>
                  <h1>user image modal</h1>
                </Dialog.Title>
                <IconButton className='absolute top-6 right-6' onClick={onClose}>
                  <XMarkIcon className='w-6 h-6 text-content-black' />
                </IconButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
