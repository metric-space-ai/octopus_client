import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';

import {authValidator} from '@/helpers/validators';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';
import {InvitationSent} from './SendInvitation';

interface ModalProps {
  open: boolean;
  existed?: boolean;
  onClose: () => void;
}

interface IFormInputs {
  name: string;
  id: number;
}

export const AddPromptAgentModal = ({open, onClose, existed = false}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {name, id} = data;
    setLoading(true);
    setLoading(false);
  };

  return (
    <>
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
                <Dialog.Panel className='w-full max-w-md transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-start mb-6'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-grey-900 text-left'
                    >
                      Add a new prompt agent
                    </Dialog.Title>
                    <IconButton className='top-4 right-4' onClick={onClose}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      className='h-10'
                      placeholder='What'
                      errors={errors.name && errors.name.message}
                      rules={register('name', authValidator.name)}
                    />

                    <Input
                      className='h-10'
                      placeholder='When'
                      errors={errors.id && errors.id.message}
                      rules={register('id', authValidator.id)}
                    />

                    <div className='flex gap-2 pt-1.5'>
                      <Button
                        className='w-1/2 !h-10 border'
                        variant='transparent'
                        title={`Cancel`}
                        loading={loading}
                        onClick={onClose}
                      />
                      <Button
                        className='w-1/2 !h-10'
                        variant='primary'
                        title={`Add an agent`}
                        loading={loading}
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
    </>
  );
};
