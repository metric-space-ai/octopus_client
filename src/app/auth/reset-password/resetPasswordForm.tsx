import React, {useState} from 'react';

import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {authValidator} from '@/helpers/validators';
import {resetPasswordApi} from '@/services/auth.service';

interface IFormInputs {
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {password} = data;
    setLoading(true);
    resetPasswordApi('', password)
      .then(() => {
        toast.success('Password changed successfully. Please login to start.');
        router.push('/auth/login');
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.error ?? 'Something went wrong.');
        setLoading(false);
      });
  };
  return (
    <form className='w-full mt-10' onSubmit={handleSubmit(onSubmit)}>
      <Input
        className='mt-5'
        type='password'
        placeholder='New Password'
        errors={errors.password && 'Password length must be 5, including letter and number.'}
        rules={register('password', authValidator.password)}
      />
      <Input
        className='mt-5'
        type='password'
        placeholder='Confirm Password'
        errors={errors.confirmPassword && 'Password length must be 5, including letter and number.'}
        rules={register('confirmPassword', authValidator.password)}
      />
      <Button className='mt-6 w-full !h-11 rounded-4xl' loading={loading} title='Reset password' />
    </form>
  );
};

export default ResetPasswordForm;
