import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {TrashIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';

import {
  getScheduledPromptItemMessages,
  updateScheduledPrompt,
} from '@/app/lib/features/scheduledPrompts/scheduledPromptsSlice';
import {AppDispatch} from '@/app/lib/store';
import {Button, IconButton} from '@/components/buttons';
import {agentPromptValidator} from '@/helpers/validators';
import useCustomCronDescription from '@/hooks/useCustomCronDescription';
import {IChatMessage, IScheduledPrompts} from '@/types';

import {DeleteAgentModal} from './DeleteAgentModal';
import AgentPromptLine from '../../agents/agent-prompt-line';
import {Input} from '../../input';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  promptData: IScheduledPrompts | null;
}

interface IFormInputs {
  prompt: string;
  desired_schedule: string;
}

export const EditPromptAgentModal = ({open, onClose, promptData}: ModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(promptData);
  const [showDeleteAgentModal, setShowDeleteAgentModal] = useState(false);
  const [agentMessages, setAgentMessages] = useState<IChatMessage[]>();
  const [visibleMessages, setVisibleMessages] = useState(10);
  const description = useCustomCronDescription(selected?.desired_schedule ?? '');
  const {
    register,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const handleShowMoreMessages = () => {
    setVisibleMessages((prev) => prev + 10);
  };

  const onSubmit = async (data: IFormInputs) => {
    if (!selected) return;
    const {prompt, desired_schedule} = data;
    console.log({prompt, desired_schedule});
    setIsLoading(true);
    try {
      const {
        meta: {requestStatus},
        payload,
      } = await dispatch(updateScheduledPrompt({form: data, agentId: selected.id}));
      if (requestStatus === 'fulfilled') {
        setSelected(payload as IScheduledPrompts);
      }
    } catch (error) {
      console.warn({error});
    } finally {
      setIsLoading(false);
    }
  };
  // const handleActiveAgentPrompt = (check: boolean) => {
  //   if (selected) {
  //     setSelected((prev) => ({...prev, active: check}));
  //   }
  // };
  const handleLogCron = () => {
    console.log('handleLogCron...', {description});
  };

  const handleGetAgentItem = async () => {
    if (!promptData) return;
    setIsLoading(true);
    try {
      const {
        meta: {requestStatus},
        payload,
      } = await dispatch(getScheduledPromptItemMessages(promptData.chat_id));
      if (requestStatus === 'fulfilled') {
        setAgentMessages(payload as IChatMessage[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('open edit agent', {selected, promptData});
    if (open) {
      handleGetAgentItem();
      setSelected(promptData);
      reset({
        prompt: promptData?.prompt ?? '',
        desired_schedule: promptData?.desired_schedule,
      });
    }
    setShowDeleteAgentModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  if (!promptData) return null;
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
                <Dialog.Panel className='w-full max-w-[1000px] transform border border-content-primary bg-grey-100 px-10 pt-10 pb-2.5 rounded-xl align-middle shadow-xl transition-all'>
                  <div className='flex justify-between items-start mb-6'>
                    <div className='flex gap-4 items-center'>
                      {/* <CustomSwitch active={true} onChange={(check: boolean) => handleActiveAgentPrompt(check)} /> */}
                      <Dialog.Title
                        as='h3'
                        className='text-2xl font-semibold text-grey-900 text-left truncate overflow-hidden max-w-lg'
                        onClick={handleLogCron}
                      >
                        {selected?.prompt}
                      </Dialog.Title>
                    </div>
                    <div className='flex gap-8 items-center'>
                      <IconButton className='top-4 right-4' onClick={() => setShowDeleteAgentModal(true)}>
                        <TrashIcon className='w-5 h-5 text-content-primary' width={20} height={20} />
                      </IconButton>
                      <IconButton className='top-4 right-4' onClick={onClose}>
                        <XMarkIcon className='w-5 h-5 text-content-primary' width={20} height={20} />
                      </IconButton>
                    </div>
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

                    <div className='mb-1 flex flex-col gap-5 max-h-[366px] overflow-auto relative -mr-10 pr-10 custom-scrollbar-thumb'>
                      {!agentMessages && isLoading && (
                        <div className='flex items-center h-22 animate-pulse rounded-xl' />
                      )}
                      {agentMessages &&
                        agentMessages.slice(0, visibleMessages).map((message: IChatMessage) => (
                          <AgentPromptLine
                            item={message}
                            key={`agents-item-${message.id}`}
                            // item={message}
                          />
                        ))}
                      {agentMessages && agentMessages.length > visibleMessages && (
                        <div className='flex justify-center pt-2'>
                          <p
                            className='w-1/3 underline text-grey-800 hover:text-primary text-base cursor-pointer'
                            onClick={handleShowMoreMessages}
                          >
                            See More
                          </p>
                        </div>
                      )}
                      {/* <div className='flex items-center gap-2'>
                        <AgentPromptLine
                          desc={'I checked the vibration level of the blade, everything is ok.'}
                          // when={'19 mins ago'}
                        />
                        <span className='font-medium text-xxs text-grey-900 min-w-max text-right block'>
                          19 mins ago
                        </span>
                      </div> */}

                      <div className='flex gap-2 pt-1.5 mb-2'>
                        <Button
                          className='w-1/2 !h-10 border'
                          variant='transparent'
                          title={`Cancel`}
                          loading={isLoading}
                          onClick={onClose}
                        />
                        <Button
                          className='w-1/2 !h-10'
                          variant='primary'
                          title={`Save Changes`}
                          loading={isLoading}
                          type='submit'
                        />
                      </div>
                    </div>
                  </form>
                  <DeleteAgentModal
                    agent={selected}
                    open={showDeleteAgentModal}
                    onClose={() => setShowDeleteAgentModal(false)}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
