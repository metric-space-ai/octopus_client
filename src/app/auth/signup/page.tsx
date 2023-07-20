'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useForm} from 'react-hook-form';

import Logo44 from '@/assets/icons/logo-44.png';
import {Button, GoogleButton} from '@/components/buttons';
import {Input} from '@/components/input';
import {useAuthContext} from '@/contexts/authContext';
import {authValidator} from '@/helpers/validators';

interface IFormInputs {
  email: string;
  username: string;
  password: string;
  repeat_password: string;
}

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IFormInputs>();
  const {loading, onRegister} = useAuthContext();

  const onSubmit = async (data: IFormInputs) => {
    const {email, username, password, repeat_password} = data;
    // setLoading(true);
    const payload = {email, name: username, password, repeat_password, job_title: 'worker'};
    onRegister(payload);
  };

  return (
    <div className='min-h-full flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
      <Image className='absolute left-10 top-10' src={Logo44} alt='logo' />
      <div className='flex flex-col items-center px-4 w-full sm:w-[370px]'>
        <h1 className='text-44 font-semibold text-content-black'>Sign Up</h1>
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
            errors={errors.password && 'Password length must be 5, including letter and number.'}
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
          <Button className='mt-1 w-full !h-11 rounded-[40px]' loading={loading} title='Sign Up' />
        </form>
        <div className='mt-6 w-full flex items-center gap-2'>
          <div className='flex-1 h-[1px] bg-content-black opacity-10' />
          <p className='text-12 text-content-grey-600'>Or</p>
          <div className='flex-1 h-[1px] bg-content-black opacity-10' />
        </div>
        <GoogleButton className='mt-6 w-full' title='Sign up with Google' />
        <span className='mt-10 text-12 font-medium text-content-grey-600'>
          Already have an account?{' '}
          <Link href='login'>
            <span className='text-14 text-content-accent'>Log In</span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
