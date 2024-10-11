import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {HandThumbDownIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Controller, SubmitHandler, useForm} from 'react-hook-form'; // Importing react-hook-form
import toast from 'react-hot-toast';

import {sendSlackMessageApi} from '@/services/chat.service';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';

import {Button, IconButton} from '../buttons';
import {Checkbox} from '../checkbox';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  message: IChatMessage;
}

interface FeedbackFormValues {
  feedback: string;
  harmful: boolean;
  untrue: boolean;
  unhelpful: boolean;
}

export const ProvideFeedbackModal = ({open, onClose, message}: ModalProps) => {
  const {workspaces, tickets, currentWorkspaceId, currentTicketId} = useChatStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {isSubmitting},
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      untrue: false,
      unhelpful: false,
      harmful: false,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset(); // Reset form fields when modal opens
    }
  }, [open, reset]);

  const sendSlackMessage = async (message: string) => {
    try {
      const response = await sendSlackMessageApi(message);
      return response.data;
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw error;
    }
  };

  const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
    setLoading(true);

    // const ticket = tickets.find((elem) => elem.id === currentTicketId);
    // const workspace = workspaces.find((elem) => elem.id === currentWorkspaceId);

    // const payload = `
    //   Feedback: ${data.feedback}\n
    //   Harmful: ${data.harmful ? 'Yes' : 'No'}\n
    //   Untrue: ${data.untrue ? 'Yes' : 'No'}\n
    //   Unhelpful: ${data.unhelpful ? 'Yes' : 'No'}\n
    //   Response: ${message.response ?? 'N/A'}\n
    //   user Name/ Id: ${message.profile.name ?? 'N/A'} / ${message.user_id}\n
    //   Workspace Id: ${currentWorkspaceId}\n
    //   Chatroom id: ${currentTicketId}\n
    //   Message Id: ${message.id}\n
    //   Used Model: ${message.used_model ?? 'N/A'}\n
    //   Wasp App Id: ${message.wasp_app_id ?? 'N/A'}\n
    //   Suggested Wasp App Id: ${message.suggested_wasp_app_id ?? 'N/A'}\n
    //   Simple App Id: ${message.simple_app_id ?? 'N/A'}\n
    //   Suggested Simple App Id: ${message.suggested_simple_app_id ?? 'N/A'}\n
    //   Message Created-At: ${message.created_at}\n
    //   }
    // `;

    const payload = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Feedback for message:*\n${message.response ?? 'N/A'}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Harmful:* ${data.harmful ? 'Yes' : 'No'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Untrue:* ${data.untrue ? 'Yes' : 'No'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Unhelpful:* ${data.unhelpful ? 'Yes' : 'No'}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Feedback:* ${data.feedback}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Used Model:* ${message.used_model ?? 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Message Wasp App Id:* ${message.wasp_app_id ?? 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Suggested Wasp App Id:* ${message.suggested_wasp_app_id ?? 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Simple App Id:* ${message.simple_app_id ?? 'N/A'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Suggested Simple App Id:* ${message.suggested_simple_app_id ?? 'N/A'}`,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*User:* ${message.profile.name ?? 'N/A'} / ${message.user_id}`,
            },
            {
              type: 'mrkdwn',
              text: `*Message Id:* ${message.id}`,
            },
            {
              type: 'mrkdwn',
              text: `*Workspace:* ${currentWorkspaceId}`,
            },
            {
              type: 'mrkdwn',
              text: `*Chatroom:* ${currentTicketId}`,
            },
          ],
        },
      ],
    };
    // console.log({ticket, workspace, payload});
    try {
      await sendSlackMessage(JSON.stringify(payload));
      toast.success('Feedback sent successfully!');
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
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
              <Dialog.Panel className='w-full flex flex-col max-w-[720px] transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl shadow-xl transition-all gap-3'>
                <IconButton className='absolute top-4 right-4' onClick={onClose}>
                  <XMarkIcon className='w-5 h-5 text-content-primary' />
                </IconButton>

                <div className='flex items-center gap-4'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-full bg-grey-0'>
                    <HandThumbDownIcon className='w-5 h-5 text-danger-500' />
                  </div>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-semibold text-grey-900'
                    onClick={() =>
                      console.log({
                        workspace: workspaces.find((elem) => elem.id === currentWorkspaceId),
                        ticket: tickets.find((elem) => elem.id === currentTicketId),
                      })
                    }
                  >
                    Provide additional feedback
                  </Dialog.Title>
                </div>

                <form className='flex flex-col mt-2 gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <textarea
                    className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-sm resize-none outline-none focus:border-grey-900'
                    placeholder='What was the issue with the response?'
                    {...register('feedback', {required: true})}
                  />

                  <div className='flex gap-4'>
                    <Controller
                      name='harmful'
                      control={control}
                      rules={{required: false}}
                      render={({field: {onChange, value}}) => (
                        <Checkbox
                          className='text-sm font-medium text-grey-600'
                          title='This is harmful'
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Controller
                      name='untrue'
                      control={control}
                      rules={{required: false}}
                      render={({field: {onChange, value}}) => (
                        <Checkbox
                          className='text-sm font-medium text-grey-600'
                          title={`This isn't true`}
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      )}
                    />
                    <Controller
                      name='unhelpful'
                      control={control}
                      rules={{required: false}}
                      render={({field: {onChange, value}}) => (
                        <Checkbox
                          className='text-sm font-medium text-grey-600'
                          title={`This isn't helpful`}
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      )}
                    />
                    {/* <Checkbox
                      className='text-sm font-medium text-grey-600'
                      title='This is harmful'
                      {...register('harmful')}
                    /> */}
                    {/* <Checkbox
                      className='text-sm font-medium text-grey-600'
                      title={`This isn't true`}
                      {...register('untrue')}
                    /> */}
                    {/* <Checkbox
                      className='text-sm font-medium text-grey-600'
                      title={`This isn't helpful`}
                      {...register('unhelpful')}
                    />
                    asdasd */}
                  </div>

                  <Button
                    type='submit'
                    className='!h-11'
                    variant='primary'
                    title='Submit feedback'
                    loading={isSubmitting || loading}
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
