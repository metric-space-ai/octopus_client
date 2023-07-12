import Image from 'next/image';
import Link from 'next/link';

import Logo44 from '@/assets/icons/logo-44.png';
import {Button, GoogleButton} from '@/components/buttons';
import {Input} from '@/components/input';

const SignupPage = () => {
  return (
    <div className='min-h-full flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
      <Image className='absolute left-10 top-10' src={Logo44} alt='logo' />
      <div className='flex flex-col items-center px-4 w-full sm:w-[370px]'>
        <h1 className='text-44 font-semibold text-content-black'>Sign Up</h1>
        <form className='w-full mt-10 flex flex-col gap-5'>
          <div className='flex gap-4'>
            <Input placeholder='First name' />
            <Input placeholder='Last name' />
          </div>
          <Input placeholder='Job title' />
          <Input type='email' placeholder='Email' />
          <Input type='password' placeholder='Password' />
          <Input type='password' placeholder='Repeat password' />
          <Button className='mt-1 w-full h-11 rounded-[40px]' title='Sign Up' />
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
