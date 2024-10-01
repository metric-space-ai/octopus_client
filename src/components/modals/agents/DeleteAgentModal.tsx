import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useDispatch} from 'react-redux';

import {
  changeOpenEditSchedulePromptDialog,
  changeSelectedSchedulePrompt,
  deleteScheduledPrompt,
} from '@/app/lib/features/scheduledPrompts/scheduledPromptsSlice';
import {AppDispatch} from '@/app/lib/store';
import {Button, IconButton} from '@/components/buttons';
import {IScheduledPrompts} from '@/types';

interface ModalProps {
  agent: IScheduledPrompts | null;
  open: boolean;
  onClose: () => void;
}

export const DeleteAgentModal = ({agent, open, onClose}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const onDelete = async () => {
    console.log(`onDelete... runs`, {agent, open});
    if (!agent) return onClose();
    setIsLoading(true);
    try {
      const {
        meta: {requestStatus},
      } = await dispatch(deleteScheduledPrompt(agent.id));
      if (requestStatus === 'fulfilled') {
        dispatch(changeSelectedSchedulePrompt(null));
        dispatch(changeOpenEditSchedulePromptDialog(false));

        onClose();
      }
    } finally {
      setIsLoading(false);
    }
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
              <Dialog.Panel className='w-full flex flex-col max-w-2xl transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl shadow-xl transition-all gap-3'>
                <div className='flex text-left gap-2'>
                  <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900'>
                    {`Delete "${agent?.prompt}" Agent`}
                  </Dialog.Title>
                  <IconButton className='ml-auto' onClick={onClose}>
                    <XMarkIcon className='w-5 h-5text-content-primary' />
                  </IconButton>
                </div>
                <p className='text-xl font-semibold mt-5 text-grey-900'>Are you sure?</p>
                <p className='text-base font-regular text-grey-800'>
                  This action is irreversible and will permanently remove the Agent and all its associated data.{' '}
                </p>
                <form className='flex mt-2 gap-2'>
                  <Button
                    type='button'
                    className='flex-1 !h-11'
                    variant='dangerous'
                    title='Delete Agent'
                    loading={isLoading}
                    onClick={onDelete}
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    className='flex-1 !h-11'
                    variant='outline'
                    title='Cancel'
                    onClick={onClose}
                    disabled={isLoading}
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
