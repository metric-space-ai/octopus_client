import React, {useState} from 'react';

import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {resetPassByUserValidator} from '@/helpers/validators';
import {resetPasswordApi} from '@/services/auth.service';
import {ClipboardIcon} from '@heroicons/react/24/outline';

interface IFormInputs {
  token: string;
  password: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {token, password, confirmPassword} = data;
    setLoading(true);
    resetPasswordApi({token, password, repeat_password: confirmPassword})
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
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue('token', text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };
  return (
    <form className='w-full mt-10' onSubmit={handleSubmit(onSubmit)}>
      <div className='relative mt-5 flex items-center w-full'>
        <Input
          className='w-full'
          type='text'
          placeholder='Token'
          errors={errors.token && 'token is required'}
          rules={register('token', resetPassByUserValidator.token)}
        />
        <ClipboardIcon
          onClick={handlePasteFromClipboard}
          className='w-6 h-6 text-grey-800 absolute right-3 p-0.5 rounded-full hover:text-primary-400 cursor-pointer bg-grey-0'
        />
      </div>
      <Input
        className='mt-5'
        type='password'
        placeholder='New Password'
        errors={errors.password && 'Password length must be 8, including letter and number.'}
        rules={register('password', resetPassByUserValidator.password)}
      />
      <Input
        className='mt-5'
        type='password'
        placeholder='Confirm Password'
        errors={errors.confirmPassword && 'Password length must be 8, including letter and number.'}
        rules={register('confirmPassword', resetPassByUserValidator.password)}
      />
      <Button className='mt-6 w-full !h-11 rounded-4xl' loading={loading} title='Reset password' />
    </form>
  );
};

export default ResetPasswordForm;
