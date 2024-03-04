'use client';

import Link from 'next/link';
import {useForm} from 'react-hook-form';

import {Button, GoogleButton} from '@/components/buttons';
import {Input} from '@/components/input';
import {Logo} from '@/components/logo';
import {useAuthContext} from '@/contexts/authContext';
import {authValidator} from '@/helpers/validators';

import {RightPanel} from '../components/right-panel';
import {useEffect} from 'react';
import {checkSetupApi} from '@/services/auth.service';
import {AxiosError} from 'axios';

import {paths} from '@/config/path';
import { useRouter } from 'next/navigation';

interface IFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();
  const {loading, onLogin} = useAuthContext();

  const onSubmit = async (data: IFormInputs) => {
    const {email, password} = data;
    onLogin(email, password);
  };

  const handleGetSetupRequired = async () => {
    try {
      const {status, data} = await checkSetupApi();
      if (status === 200) {
        if (data.setup_required) router.push(paths.installation);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response?.data.error);
      }
    }
    // setSetupRequired(res.data?.setup_required ?? false);
  };
  useEffect(() => {
    handleGetSetupRequired();
  }, []);

  return (
    <div className='min-h-full grid sm:grid-cols-2 gap-3'>
      <div className='flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
        <Logo className='absolute left-10 top-10' withText />
        <h1 className='text-32 font-semibold text-content-black text-center'>Welcome back to Octopus AI</h1>
        <div className='flex flex-col items-center px-4 w-full sm:w-[370px]'>
          <p className='mt-2 text-base text-content-grey-600'>Please enter your details</p>
          <form className='w-full mt-10' onSubmit={handleSubmit(onSubmit)}>
            <Input
              type='email'
              placeholder='Email'
              errors={errors.email && errors.email.message}
              rules={register('email', authValidator.email)}
            />
            <Input
              className='mt-5'
              type='password'
              placeholder='Password'
              errors={errors.password && 'Password length must be 5, including letter and number.'}
              rules={register('password', authValidator.password)}
            />
            <div className='mt-3 flex justify-end'>
              <Link href='forgot-password'>
                <p className='text-xs text-content-grey-600'>Forgot password?</p>
              </Link>
            </div>
            <Button className='mt-6 w-full !h-11 rounded-[40px]' loading={loading} title='Log In' />
          </form>
          <div className='mt-6 w-full flex items-center gap-2'>
            <div className='flex-1 h-[1px] bg-content-black opacity-10' />
            <p className='text-xs text-content-grey-600'>Or</p>
            <div className='flex-1 h-[1px] bg-content-black opacity-10' />
          </div>
          <GoogleButton className='mt-6 w-full' title='Continue with Google' />
          <span className='mt-10 text-xs text-content-grey-600'>
            Don’t have an account?{' '}
            <Link href='signup'>
              <span className='text-sm text-content-accent underline'>Sign up</span>
            </Link>
          </span>
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default LoginPage;
