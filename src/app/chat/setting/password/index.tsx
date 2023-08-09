'use client';

import {useState} from 'react';

import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {authValidator} from '@/helpers/validators';
import {changePassword} from '@/services/auth.service';
import {useAuthStore} from '@/store';

interface IFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const PasswordPage = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();
  const [loading, setLoading] = useState(false);
  const {authData} = useAuthStore();

  const onSubmit = async (data: IFormInputs) => {
    const {currentPassword, newPassword} = data;
    if (authData) {
      setLoading(true);
      try {
        await changePassword(authData.user_id, currentPassword, newPassword);
        toast.success('Password changed successfully!');
        reset();
      } catch {
        toast.error('Something went wrong. Please try again!');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='w-full pt-[84px] flex flex-col items-center'>
      <form className='w-[360px] flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          type='password'
          label='Current Password'
          placeholder='Current Password'
          errors={errors.currentPassword && 'Password length must be 5, including letter and number.'}
          rules={register('currentPassword', authValidator.password)}
        />
        <Input
          type='password'
          label='New Password'
          placeholder='New Password'
          errors={errors.newPassword && errors.newPassword.message}
          rules={register('newPassword', authValidator.password)}
        />
        <Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password'
          errors={errors.confirmNewPassword && errors.confirmNewPassword.message}
          rules={register('confirmNewPassword', authValidator.password)}
        />
        <div className='flex justify-between gap-4'>
          <Button className='flex-1' title='Save' loading={loading} />
          <Button type='button' variant='outline' className='flex-1' title='Cancel' />
        </div>
      </form>
    </div>
  );
};

export default PasswordPage;
