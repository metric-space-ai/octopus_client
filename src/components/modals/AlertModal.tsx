import {Fragment} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../buttons';

interface AlertModalProps {
  headTitle?: string;
  title?: string;
  description?: string;
  open: boolean;
  loading?: boolean;
  confirmTitle?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const AlertModal = ({
  headTitle,
  title,
  description,
  open,
  loading,
  confirmTitle,
  onConfirm,
  onClose,
}: AlertModalProps) => {
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
              <Dialog.Panel className='w-full flex flex-col max-w-xl transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] shadow-xl transition-all gap-3'>
                <IconButton className='absolute top-4 right-4' onClick={onClose}>
                  <XMarkIcon className='w-4 h-4 text-content-primary' />
                </IconButton>
                <Dialog.Title as='h3' className='text-2xl font-semibold text-content-primary mb-5'>
                  {headTitle}
                </Dialog.Title>
                <p className='text-xl font-semibold'>{title}</p>
                <p className='text-base font-medium text-content-grey-600'>{description}</p>
                <form className='flex mt-2 gap-2'>
                  <Button
                    type='button'
                    className='h-11 flex-1'
                    variant='dangerous'
                    title={confirmTitle ?? 'Ok'}
                    loading={loading}
                    onClick={onConfirm}
                  />
                  <Button type='button' className='h-11 flex-1' variant='outline' title='Cancel' onClick={onClose} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
