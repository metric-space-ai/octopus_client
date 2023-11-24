import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../buttons';
import {IUser} from '@/types';

interface ModalProps {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
  member: IUser;
}

export const RemoveTeamMemberModal = ({open, onClose, onDelete, member}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const handleDeleteUser = () => {
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
                <div className='flex text-left gap-2 mb-5'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-semibold text-content-black max-w-sm truncate overflow-hidden'
                    title={`Remove team member: “${member.email}” `}
                  >
                    {`Remove: “${member.email}” `}
                  </Dialog.Title>
                  <IconButton
                    className='ml-auto !p-1'
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <XMarkIcon className='w-5 h-5text-content-primary' />
                  </IconButton>
                </div>
                <>
                  <p className='text-xl font-semibold text-content-grey-900'>Are you sure?</p>
                  <p className='text-base font-poppins-regular text-content-grey-600'>
                    This action is irreversible and will permanently remove the tab and all its associated data.
                  </p>
                  <form className='flex mt-2 gap-2'>
                    <Button
                      type='button'
                      className='flex-1 !h-11'
                      variant='dangerous'
                      title='Remove member'
                      loading={loading}
                      onClick={onDelete}
                    />
                    <Button
                      type='button'
                      className='flex-1 !h-11'
                      variant='outline'
                      title='Cancel'
                      onClick={handleDeleteUser}
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
