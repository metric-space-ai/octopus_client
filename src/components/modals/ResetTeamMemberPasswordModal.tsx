import {Fragment, useState} from 'react';

import {AxiosError} from 'axios';

import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';

import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {authValidator} from '@/helpers/validators';

import {Button, IconButton} from '../buttons';
import {Input} from '../input';

import {resetTeamMemberPasswordApi} from '@/services/settings.service';

import {IUser} from '@/types';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  member: IUser;
}

export const ResetTeamMemberPasswordModal = ({open, onClose, member}: ModalProps) => {
  const [loading, setLoading] = useState(false);

  interface IFormInputs {
    newPassword: string;
    confirmNewPassword: string;
  }
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (formInputsData: IFormInputs) => {
    setLoading(true);
    try {
      const {status} = await resetTeamMemberPasswordApi(member.id, formInputsData.newPassword);
      console.log('runss');
      if (status === 200) {
        toast.success('Password successfully reset');
        onClose();
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log({err, response: err?.response});
        toast.error(err.response?.data.error ?? err.message);
      }
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
              <Dialog.Panel className='w-full flex flex-col max-w-2xl transform border border-content-primary bg-grey-100 px-10 py-10 rounded-xl shadow-xl transition-all gap-3'>
                <div className='flex text-left gap-2 mb-5 relative'>
                  <Dialog.Title
                    as='h3'
                    className='text-2xl font-semibold text-grey-900 max-w-sm break-words'
                    title={`Reset team member Password: “${member.email}” `}
                  >
                    {`Reset team member Password: “${member.email}”`}
                  </Dialog.Title>
                  <IconButton
                    className='ml-auto !p-1 absolute top-0 right-0'
                    onClick={() => {
                      onClose();
                    }}
                  >
                    <XMarkIcon className='w-5 h-5 text-content-primary' />
                  </IconButton>
                </div>

                <form className='flex flex-col mt-5 gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    type='password'
                    label='New Password'
                    placeholder='New Password'
                    errors={errors.newPassword && errors.newPassword.message}
                    rules={register('newPassword', {...authValidator.password})}
                  />
                  <Input
                    type='password'
                    label='Confirm Password'
                    placeholder='Confirm Password'
                    errors={errors.confirmNewPassword && errors.confirmNewPassword.message}
                    rules={register('confirmNewPassword', {
                      required: true,
                      validate: (val: string) => {
                        if (watch('newPassword') !== val) {
                          return 'Your password does not match.';
                        }
                      },
                    })}
                  />
                  <Button
                    className='mt-2 w-full !h-11'
                    variant='primary'
                    loading={loading}
                    disabled={loading}
                    title={loading ? '' : 'Reset Password'}
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
