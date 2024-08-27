/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';

import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';

import {Button, GoogleButton} from '@/components/buttons';
import {Input} from '@/components/input';
import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';
import {authValidator} from '@/helpers/validators';

interface IFormInputs {
  email: string;
  username: string;
  password: string;
  repeat_password: string;
}
const SignUpForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IFormInputs>();
  const {loading, onRegister, onCheckSetup, setupInfo, setupInfoLoading} = useAuthContext();

  const onSubmit = async (data: IFormInputs) => {
    const {email, username, password, repeat_password} = data;
    // setLoading(true);
    const payload = {email, name: username, password, repeat_password, job_title: 'worker'};
    onRegister(payload);
  };
  useEffect(() => {
    if (!setupInfo && !setupInfoLoading) {
      onCheckSetup();
    }
  }, []);
  const redirectToInstallation = () => router.push(paths.installation);

  useEffect(() => {
    if (setupInfo) {
      const {setup_required, registration_allowed} = setupInfo;
      if (setup_required && registration_allowed) redirectToInstallation();
    }
  }, [setupInfo]);
  return (
    <>
      <form className='w-full mt-10 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder='Username'
          errors={errors.username && errors.username.message}
          rules={register('username', authValidator.username)}
        />
        <Input
          type='email'
          placeholder='Email'
          errors={errors.email && errors.email.message}
          rules={register('email', authValidator.email)}
        />
        <Input
          type='password'
          placeholder='Password'
          errors={
            errors.password && watch('password').includes('/')
              ? 'password cannot have the special caracters like `/|*&^`'
              : 'Password length must be 8, including letter and number.'
          }
          rules={register('password', authValidator.password)}
        />
        <Input
          type='password'
          placeholder='Repeat password'
          errors={errors.repeat_password && 'Password do not match'}
          rules={register('repeat_password', {
            required: true,
            validate: (val: string) => {
              if (watch('password') !== val) {
                return 'Your password does not match.';
              }
            },
          })}
        />
        <Button className='mt-1 w-full !h-11 rounded-4xl' loading={loading} title='Sign Up' />
      </form>
      <div className='mt-6 w-full flex items-center gap-2'>
        <div className='flex-1 h-[1px] bg-grey-900 opacity-10' />
        <p className='text-xs text-grey-600'>Or</p>
        <div className='flex-1 h-[1px] bg-grey-900 opacity-10' />
      </div>
      <GoogleButton className='mt-6 w-full' title='Sign up with Google' />
    </>
  );
};

export default SignUpForm;
