import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {ISimpleApp} from '@/types';

import {Button, IconButton} from '../buttons';

interface ModalProps {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
  simpleApp: ISimpleApp;
}

export const RemoveSimpleAppModal = ({open, onClose, onDelete, simpleApp}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [deleteStarted, setDeleteStarted] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [percent, setPercent] = useState(0);

  const handleDeleteSimpleApp = () => {
    onDelete();
    setDeleteStarted(true);
    setLoading(false);
  };

  useEffect(() => {
    if (deleteStarted) {
      const countdown = () => {
        if (percent >= 100) {
          setDeleteConfirmed(true);
          setDeleteStarted(false);
        } else {
          setPercent((percent) => ++percent);
        }
      };
      setTimeout(countdown, 10);
    }
  }, [deleteStarted, percent]);

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
                <div className='flex text-left gap-2 mb-5'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-semibold text-grey-900 max-w-sm truncate overflow-hidden'
                  >
                    {deleteStarted
                      ? `“${simpleApp.name}” removing`
                      : deleteConfirmed
                      ? `SimpleApp removed`
                      : `Remove “${simpleApp.name}” `}
                  </Dialog.Title>
                  <IconButton
                    className='ml-auto !p-1'
                    onClick={() => {
                      onClose();
                      setDeleteStarted(false);
                      setDeleteConfirmed(false);
                      setPercent(0);
                    }}
                  >
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                </div>
                {deleteStarted ? (
                  <div className='flex flex-col'>
                    <div className='flex justify-between mb-5'>
                      <p className='text-grey-800 text-sm '>The simpleApp is being removed, please wait</p>
                      <span className='text-grey-900 text-xs font-medium tracking-[-1px] flex items-center'>
                        {`${percent} %`}
                      </span>
                    </div>
                    <div className='h-1 w-full bg-grey-0 dark:bg-neutral-600'>
                      <div className='h-1 bg-danger-500 transition-all' style={{width: `${percent}%`}}></div>
                    </div>
                  </div>
                ) : deleteConfirmed ? (
                  <div className='flex flex-col'>
                    <div className='flex justify-between mb-5'>
                      <p className='text-grey-800 text-sm flex gap-3 items-center'>
                        <span className='p-1.5 rounded-full bg-danger-500/10'>
                          <TrashIcon className='text-grey-900' width={16} height={16} />
                        </span>
                        SimpleApp successfully removed
                      </p>
                      <span className='text-grey-900 text-xs font-medium tracking-[-1px] flex items-center'>
                        {`${percent} %`}
                      </span>
                    </div>
                    <div className='h-1 w-full bg-grey-0 dark:bg-neutral-600'>
                      <div className='h-1 bg-danger-500 transition-all' style={{width: `${percent}%`}}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className='text-xl font-semibold text-grey-800'>Are you sure?</p>
                    <p className='text-base font-regular text-grey-600'>
                      This action is irreversible and will permanently remove the tab and all its associated data.
                    </p>
                    <form className='flex mt-2 gap-2'>
                      <Button
                        type='button'
                        className='flex-1 !h-11'
                        variant='dangerous'
                        title='Remove simpleApp'
                        loading={loading}
                        onClick={handleDeleteSimpleApp}
                      />
                      <Button
                        type='button'
                        className='flex-1 !h-11'
                        variant='outline'
                        title='Cancel'
                        onClick={onClose}
                      />
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
