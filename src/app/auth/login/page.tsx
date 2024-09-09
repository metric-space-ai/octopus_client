/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {useEffect} from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import {Logo} from '@/components/logo';
import {useThemeStore} from '@/store/themeData';

const DynamicLoginForm = dynamic(async () => (await import('./form')).default, {
  ssr: false,
});
const DynamicRightPanel = dynamic(async () => (await import('../components/right-panel')).RightPanel, {
  ssr: false,
});

const DynamicGoogleButton = dynamic(async () => (await import('@/components/buttons')).GoogleButton, {
  ssr: false,
  loading: () => (
    <div className='h-11 flex items-center justify-center px-4 gap-4 rounded-xl bg-grey-50 animate-pulse mt-6 w-full' />
  ),
});

const LoginPage = () => {
  const {themeData, handleSetColorVariable} = useThemeStore();
  // const {
  //   cssVariables,
  //   content: {head_logo, title},
  // } = themeData;

  useEffect(() => {
    if (themeData?.cssVariables) {
      handleSetColorVariable(themeData.cssVariables);
    }
  }, []);

  return (
    <div className='min-h-full grid sm:grid-cols-2 gap-3'>
      <div className='flex flex-col items-center justify-center bg-grey-100 rounded-xl'>
        {themeData?.content.head_logo ? (
          <Image
            className='absolute left-10 top-10'
            src={themeData.content.head_logo.url}
            alt={themeData.content.head_logo.alt ?? 'head logo'}
            width={themeData.content.head_logo.width}
            height={themeData.content.head_logo.height}
            loading='lazy'
          />
        ) : (
          <Logo className='absolute left-10 top-10' withText />
        )}
        <h1 className='text-32 font-semibold text-grey-900 text-center'>
          Welcome back to {themeData?.content.title ?? 'Octopus AI'}
        </h1>
        <div className='flex flex-col items-center px-4 w-full sm:w-[370px]'>
          <p className='mt-2 text-base text-grey-600'>Please enter your details</p>
          <DynamicLoginForm />

          <div className='mt-6 w-full flex items-center gap-2'>
            <div className='flex-1 h-[1px] bg-grey-900 opacity-10' />
            <p className='text-xs text-grey-600'>Or</p>
            <div className='flex-1 h-[1px] bg-grey-900 opacity-10' />
          </div>
          <DynamicGoogleButton className='mt-6 w-full' title='Continue with Google' />
          <span className='mt-10 text-xs text-grey-600'>
            Don’t have an account?{' '}
            <Link href='signup'>
              <span className='text-sm text-primary underline'>Sign up</span>
            </Link>
          </span>
        </div>
      </div>
      <DynamicRightPanel />
    </div>
  );
};

export default LoginPage;
