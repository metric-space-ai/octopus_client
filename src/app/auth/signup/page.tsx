/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import {Logo} from '@/components/logo';
import {Spinner} from '@/components/spinner';

const DynamicSignUpForm = dynamic(async () => (await import('./signUpForm')).default, {
  ssr: false,
  loading: () => (
    <Spinner size='medium' className='w-full mt-10 h-full min-h-[420px] flex items-center justify-center' />
  ),
});
const SignupPage = () => {
  return (
    <div className='min-h-full flex flex-col items-center justify-center bg-grey-100 rounded-xl'>
      <Logo className='absolute left-10 top-10' withText />
      <div className='flex flex-col items-center px-4 w-full sm:w-[370px]'>
        <h1 className='text-5.5xl font-semibold text-grey-900'>Sign Up</h1>
        <DynamicSignUpForm />
        <span className='mt-10 text-xs text-grey-600'>
          Already have an account?{' '}
          <Link href='login'>
            <span className='text-sm text-primary underline'>Log In</span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
