import {Fragment} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import { XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';


import {Button, IconButton} from '../buttons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInputs {
}

export const InvitationSent = ({open, onClose}: ModalProps) => {

  const {
    handleSubmit,
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    onClose();
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
              <Dialog.Panel className='w-full max-w-md transform border border-content-primary bg-content-grey-100 px-10 py-10 rounded-[20px] align-middle shadow-xl transition-all'>
                <IconButton className='absolute top-4 right-4' onClick={onClose}>
                  <XMarkIcon className='w-5 h-5 text-content-primary' />
                </IconButton>
                <Dialog.Title as='h3' className='text-left text-2xl font-semibold text-content-black'>
                Invitation Sent!
                </Dialog.Title>
                <form className='flex flex-col mt-5 gap-6' onSubmit={handleSubmit(onSubmit)}>
                 <p className='text-content-grey-600 text-left'>
                 Your invitation to join the team has been sent successfully.
                 </p>
                  <div className='flex pt-0.5'>
                    <Button
                      className='mt-2 w-full !h-10'
                      variant='primary'
                      title={`close`}
                      type='submit'
                    />
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
