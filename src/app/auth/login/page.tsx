import Image from 'next/image';
import Link from 'next/link';

import Logo44 from '@/assets/icons/logo-44.png';
import {Button, GoogleButton} from '@/components/buttons';
import {Input} from '@/components/input';

const LoginPage = () => {
  return (
    <div className='min-h-full flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
      <Image className='absolute left-10 top-10' src={Logo44} alt='logo' />
      <div className='flex flex-col items-center px-4 w-full sm:w-[370px]'>
        <h1 className='text-44 font-semibold text-content-black'>Log In</h1>
        <form className='w-full mt-10'>
          <Input type='email' placeholder='Email' />
          <Input className='mt-5' type='password' placeholder='Password' />
          <div className='mt-3 flex justify-end'>
            <Link href='/forgot-password'>
              <p className='text-12 text-content-grey-600'>Forgot password?</p>
            </Link>
          </div>
          <Button className='mt-6 w-full h-11 rounded-[40px]' title='Log In' />
        </form>
        <div className='mt-6 w-full flex items-center gap-2'>
          <div className='flex-1 h-[1px] bg-content-black opacity-10' />
          <p className='text-12 text-content-grey-600'>Or</p>
          <div className='flex-1 h-[1px] bg-content-black opacity-10' />
        </div>
        <GoogleButton className='mt-6 w-full' title='Continue with Google' />
        <span className='mt-10 text-12 font-medium text-content-grey-600'>
          Don’t have an account?{' '}
          <Link href='signup'>
            <span className='text-14 text-content-accent'>Sign up</span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
