'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import {Logo} from '@/components/logo';
import {Spinner} from '@/components/spinner';

import {RightPanel} from '../components/right-panel';

const DynamicResetpasswordForm = dynamic(async () => (await import('./resetPasswordForm')).default, {
  ssr: false,
  loading: () => (
    <Spinner size='medium' className='w-full mt-10 h-full min-h-[360px] flex items-center justify-center' />
  ),
});

const ResetPasswordPage = () => {
  return (
    <div className='min-h-full grid sm:grid-cols-2 gap-3'>
      <div className='flex flex-col items-center justify-center bg-grey-100 rounded-xl'>
        <Logo className='absolute left-10 top-10' withText />
        <h1 className='text-32 font-semibold text-grey-900 text-center'>Reset password.</h1>
        <div className='flex flex-col items-center px-4 w-full sm:w-[400px]'>
          <p className='mt-2 text-base text-grey-600 text-center'>
            Please enter a token from your email and create a new password!
          </p>
          <DynamicResetpasswordForm />
          <Link className='mt-10' href='login'>
            <span className='text-sm text-primary underline'>Back to Log in</span>
          </Link>
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default ResetPasswordPage;
