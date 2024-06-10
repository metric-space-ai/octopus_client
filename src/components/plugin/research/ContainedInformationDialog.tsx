import {Fragment} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '@/components/buttons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  containedInformation: string;
}

export const ContainedInformationDialog = ({open, onClose, containedInformation}: ModalProps) => {
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
              <Dialog.Panel className='w-full max-w-6xl transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] align-middle shadow-xl transition-all'>
                <div className='flex justify-between items-center mb-3'>
                  <Dialog.Title as='h3' className='text-left text-2xl font-semibold text-content-grey-900'>
                    {'Contained Information'}
                  </Dialog.Title>
                  <IconButton className='' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                </div>
                <div className='flex w-full custom-scrollbar-thumb text-left max-h-[75vh]'>
                  <p className=' text-sm leading-6'>{containedInformation}</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
