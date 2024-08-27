/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {useEffect} from 'react';

import classNames from 'classnames';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';
import {loginFormValidator} from '@/helpers/validators';

interface IFormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const {setupInfo, onLogin, onCheckSetup, setupInfoLoading, loading} = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {email, password} = data;
    console.log('submit login');
    onLogin(email, password);
  };

  useEffect(() => {
    if (!setupInfo && !setupInfoLoading) {
      onCheckSetup();
    }
  }, []);
  useEffect(() => {
    if (setupInfo) {
      const {setup_required, registration_allowed} = setupInfo;
      if (setup_required && registration_allowed) router.push(paths.installation);
    }
  }, [setupInfo]);
  return (
    <form className={classNames('w-full mt-10', loading && 'pointer-events-none')} onSubmit={handleSubmit(onSubmit)}>
      <Input
        type='email'
        placeholder='Email'
        errors={errors.email && errors.email.message}
        rules={register('email', loginFormValidator.email)}
      />
      <Input
        className='mt-5'
        type='password'
        placeholder='Password'
        errors={errors.password && errors.password.message}
        rules={register('password', loginFormValidator.password)}
      />
      <div className='mt-3 flex justify-end'>
        <Link href='forgot-password'>
          <p className='text-xs text-grey-600'>Forgot password?</p>
        </Link>
      </div>
      <Button
        type='submit'
        className='mt-6 w-full !h-11 rounded-4xl'
        loading={loading}
        disabled={loading}
        title='Log In'
      />
    </form>
  );
};

export default LoginForm;
