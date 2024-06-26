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
import {forgotPassword} from '@/services/auth.service';

import {RightPanel} from '../components/right-panel';

interface IFormInputs {
  email: string;
}

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {email} = data;
    setLoading(true);
    forgotPassword(email)
      .then(() => {
        toast.success('We sent a link to the reset password page. Please check your email.');
        router.push('/auth/reset-password');
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.error ?? 'Something went wrong.');
        setLoading(false);
      });
  };

  return (
    <div className='min-h-full grid sm:grid-cols-2 gap-3'>
      <div className='flex flex-col items-center justify-center bg-grey-100 rounded-xl'>
        <Logo className='absolute left-10 top-10' withText />
        <h1 className='text-32 font-semibold text-grey-900 text-center'>Forgot password?</h1>
        <div className='flex flex-col items-center px-4 w-full sm:w-[400px]'>
          <p className='mt-2 text-base text-grey-600'>No worries, we’ll send you reset instructions.</p>
          <form className='w-full mt-10' onSubmit={handleSubmit(onSubmit)}>
            <Input
              type='email'
              placeholder='Enter your email'
              errors={errors.email && errors.email.message}
              rules={register('email', authValidator.email)}
            />
            <Button className='mt-6 w-full !h-11 rounded-4xl' loading={loading} title='Reset password' />
          </form>
          <Link className='mt-10' href='login'>
            <span className='between_sm_base text-primary underline'>Back to Log in</span>
          </Link>
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default ForgotPasswordPage;
