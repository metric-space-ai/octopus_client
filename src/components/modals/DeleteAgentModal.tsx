import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import {Button, IconButton} from '../buttons';

interface ModalProps {
  tab: IWorkspace | null;
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteAgentModal = ({tab, open, onClose, onDelete}: ModalProps) => {
  const [loading, setLoading] = useState(false);

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
              <Dialog.Panel className='w-full flex flex-col max-w-[460px] transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl shadow-xl transition-all gap-3'>
                <div className='flex text-left gap-2'>
                  <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900'>
                    {`Delete "${tab?.name}" Agent`}
                  </Dialog.Title>
                  <IconButton className='ml-auto' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5text-content-primary' />
                  </IconButton>
                </div>
                <p className='text-xl font-semibold mt-5 text-grey-900'>Are you sure?</p>
                <p className='text-base font-regular text-grey-800'>
                  This action is irreversible and will permanently remove the tab and all its associated data.{' '}
                </p>
                <form className='flex mt-2 gap-2'>
                  <Button
                    type='button'
                    className='flex-1 !h-11'
                    variant='dangerous'
                    title='Delete Agent'
                    loading={loading}
                    onClick={onDelete}
                  />
                  <Button type='button' className='flex-1 !h-11' variant='outline' title='Cancel' onClick={onClose} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
