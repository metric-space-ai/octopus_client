import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {HandThumbDownIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {Button, IconButton} from '../buttons';
import {Checkbox} from '../checkbox';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProvideFeedbackModal = ({open, onClose}: ModalProps) => {
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
                <IconButton className='absolute top-4 right-4' onClick={onClose}>
                  <XMarkIcon className='w-4 h-4 text-content-primary' />
                </IconButton>
                <div className='flex items-center gap-2'>
                  <HandThumbDownIcon className='w-5 h-5 text-content-red-600' />
                  <Dialog.Title as='h3' className='text-24 font-semibold text-content-primary'>
                    Provide additional feedback
                  </Dialog.Title>
                </div>
                <form className='flex flex-col mt-2 gap-5'>
                  <textarea
                    className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-[10px] resize-none outline-none focus:border-content-black'
                    placeholder='What was the issue with the response?'
                  />
                  <div className='flex gap-4'>
                    <Checkbox className='text-14 font-medium text-content-grey-600' title='This is harmful' />
                    <Checkbox className='text-14 font-medium text-content-grey-600' title={`This isn't true`} />
                    <Checkbox className='text-14 font-medium text-content-grey-600' title={`This isn't helpful`} />
                  </div>
                  <Button type='button' className='h-11' variant='primary' title='Submit feedback' loading={loading} />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
