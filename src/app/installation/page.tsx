'use client';

import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {Logo} from '@/components/logo';
import {useAuthContext} from '@/contexts/authContext';
import {authValidator} from '@/helpers/validators';

interface IFormInputs {
  email: string;
  username: string;
  password: string;
  repeat_password: string;
}

const InstallationPage = () => {
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
    <div className='min-h-full flex flex-col items-center justify-center'>
      <div className='w-full md:w-[940px] py-[64px] flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
        <div className='flex flex-col items-center px-4 w-full sm:w-[640px]'>
          <div className='flex gap-4'>
            <h1 className='text-32 font-semibold text-content-black'>Welcome to Octopus AI</h1>
            <Logo />
          </div>
          <p className='mt-4 text-14 text-content-grey-600 text-center'>
            Welcome to Octopus AI Installation! Simply enter the information below to start using reliable personalized
            AI language model.
          </p>
          <form className='max-w-[370px] w-full mt-10 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
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
            <span className='text-10 font-medium text-center text-content-grey-600'>
              Important: Please keep this password as you will need it for login.
            </span>
            <Button className='mt-4 w-full !h-11 rounded-[40px]' loading={loading} title='Install Octopus AI' />
          </form>
          <span className='mt-2 text-12 font-medium text-content-grey-600'>
            Please double-check your information before proceeding.
          </span>
        </div>
      </div>
    </div>
  );
};

export default InstallationPage;
