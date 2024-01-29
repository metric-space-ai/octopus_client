import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../buttons';

interface ModalProps {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export const RemoveParameterModal = ({open, onClose, onDelete}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const handleDeleteParameter = () => {
    setLoading(true);
    onDelete();
  };
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
              <Dialog.Panel className='w-full flex flex-col max-w-lg transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] shadow-xl transition-all gap-3'>
                <div className='flex justify-between gap-2 mb-5 items-start'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-poppins-semibold text-content-black max-w-sm truncate ...'
                    title={`Delete parameter`}
                  >
                    Delete
                  </Dialog.Title>
                  <IconButton
                    className='ml-auto !p-0'
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                </div>
                <>
                  <p className='text-xl font-semibold text-content-grey-900'>Are you sure?</p>
                  <p className='text-base font-poppins-regular text-content-grey-600'>
                    This action is irreversible and will permanently remove parameter.
                  </p>
                  <form className='flex mt-2 gap-2'>
                    <Button
                      type='button'
                      className='flex-1 !h-11'
                      variant='dangerous'
                      title='Remove parameter'
                      loading={loading}
                      onClick={onDelete}
                    />
                    <Button
                      type='button'
                      className='flex-1 !h-11'
                      variant='outline'
                      title='Cancel'
                      onClick={handleDeleteParameter}
                    />
                  </form>
                </>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
