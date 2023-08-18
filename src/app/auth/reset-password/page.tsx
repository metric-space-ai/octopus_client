'use client';

import {useState} from 'react';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {Logo} from '@/components/logo';
import {authValidator} from '@/helpers/validators';
import {resetPassword} from '@/services/auth.service';

import {RightPanel} from '../components/right-panel';

interface IFormInputs {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
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
    resetPassword('', password)
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
    <div className='min-h-full grid sm:grid-cols-2 gap-3'>
      <div className='flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
        <Logo className='absolute left-10 top-10' withText />
        <h1 className='text-32 font-semibold text-content-black text-center'>Reset password.</h1>
        <div className='flex flex-col items-center px-4 w-full sm:w-[400px]'>
          <p className='mt-2 text-16 text-content-grey-600 text-center'>
            Please enter a token from your email and create a new password!
          </p>
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
            <Button className='mt-6 w-full !h-11 rounded-[40px]' loading={loading} title='Reset password' />
          </form>
          <Link className='mt-10' href='login'>
            <span className='text-14 text-content-accent underline'>Back to Log in</span>
          </Link>
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default ResetPasswordPage;
