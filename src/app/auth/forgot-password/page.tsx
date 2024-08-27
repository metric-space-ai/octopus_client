'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import {Logo} from '@/components/logo';
import {Spinner} from '@/components/spinner';

const DynamicRightPanel = dynamic(async () => (await import('../components/right-panel')).RightPanel, {
  ssr: false,
});

const DynamicForgetpasswordForm = dynamic(async () => (await import('./forgetpasswordForm')).default, {
  ssr: false,
  loading: () => (
    <Spinner size='medium' className='w-full mt-10 h-full min-h-[108px] flex items-center justify-center' />
  ),
});

const ForgotPasswordPage = () => {
  return (
    <div className='min-h-full grid sm:grid-cols-2 gap-3'>
      <div className='flex flex-col items-center justify-center bg-grey-100 rounded-xl'>
        <Logo className='absolute left-10 top-10' withText />
        <h1 className='text-32 font-semibold text-grey-900 text-center'>Forgot password?</h1>
        <div className='flex flex-col items-center px-4 w-full sm:w-[400px]'>
          <p className='mt-2 text-base text-grey-600'>No worries, we’ll send you reset instructions.</p>
          <DynamicForgetpasswordForm />
          <Link className='mt-10' href='login'>
            <span className='between_sm_base text-primary underline'>Back to Log in</span>
          </Link>
        </div>
      </div>
      <DynamicRightPanel />
    </div>
  );
};

export default ForgotPasswordPage;
