import {Fragment, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';

import {createScheduledPrompts} from '@/app/lib/features/scheduledPrompts/scheduledPromptsSlice';
import {AppDispatch} from '@/app/lib/store';
import {agentPromptValidator} from '@/helpers/validators';

import {Button, IconButton} from '../../buttons';
import {Input} from '../../input';

interface ModalProps {
  open: boolean;
  existed?: boolean;
  onClose: () => void;
}

interface IFormInputs {
  prompt: string;
  desired_schedule: string;
}

export const AddPromptAgentModal = ({open, onClose, existed = false}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {desired_schedule, prompt} = data;
    setIsLoading(true);

    try {
      const {
        meta: {requestStatus},
      } = await dispatch(createScheduledPrompts({desired_schedule, prompt}));

      if (requestStatus === 'fulfilled') {
        onClose();
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
    console.log('AddPromptAgentModal..onSubmit', {name, existed});
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
                    <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900 text-left'>
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
                      errors={errors.prompt && errors.prompt.message}
                      rules={register('prompt', agentPromptValidator.prompt)}
                    />

                    <Input
                      className='h-10'
                      placeholder='When'
                      errors={errors.desired_schedule && errors.desired_schedule.message}
                      rules={register('desired_schedule', agentPromptValidator.desired_schedule)}
                    />

                    <div className='flex gap-2 pt-1.5'>
                      <Button
                        className='w-1/2 !h-10 border'
                        variant='transparent'
                        title={`Cancel`}
                        loading={isLoading}
                        onClick={onClose}
                        disabled={isLoading}
                      />
                      <Button
                        className='w-1/2 !h-10'
                        variant='primary'
                        title={`Add an agent`}
                        loading={isLoading}
                        disabled={isLoading}
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
