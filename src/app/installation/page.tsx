'use client';

import {useEffect, useState} from 'react';

import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {Logo} from '@/components/logo';
import {authValidator} from '@/helpers/validators';
import {checkSetupApi, setupApi} from '@/services/auth.service';

interface IFormInputs {
  email: string;
  company_name: string;
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
  const [setupRequired, setSetupRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  // const disabled = !setupRequired;

  useEffect(() => {
    checkSetupApi().then((res) => {
      setSetupRequired(res.data?.setup_required ?? false);
    });
  }, []);

  const onSubmit = async (data: IFormInputs) => {
    const {email, company_name, password, repeat_password} = data;
    setLoading(true);
    const payload = {email, company_name, password, repeat_password};
    setupApi(payload)
      .then(() => {
        setLoading(false);
        setSetupRequired(false);
        toast.success('Company account registered successfully!.');
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className='min-h-full flex flex-col items-center justify-center'>
      <div className='w-full md:w-[940px] py-[64px] flex flex-col items-center justify-center bg-content-grey-100 rounded-[20px]'>
        <div className='flex flex-col items-center px-4 w-full sm:w-[640px]'>
          <div className='flex gap-4'>
            <h1 className='text-32 font-semibold text-content-black'>Welcome to Octopus AI</h1>
            <Logo />
          </div>
          <p className='mt-4 text-sm text-content-grey-600 text-center'>
            Welcome to Octopus AI Installation! Simply enter the information below to start using reliable personalized
            AI language model.
          </p>
          <form className='max-w-[370px] w-full mt-10 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
            <Input
              placeholder='Company Name'
              errors={errors.company_name && errors.company_name.message}
              rules={register('company_name', authValidator.username)}
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
            <span className='text-xxs text-center text-content-grey-600'>
              Important: Please keep this password as you will need it for login.
            </span>
            <Button
              className='mt-4 w-full !h-11 rounded-[40px]'
              disabled={!setupRequired}
              loading={loading}
              title='Install Octopus AI'
            />
          </form>
          <span className='mt-2 text-xs text-content-grey-600'>
            Please double-check your information before proceeding.
          </span>
        </div>
      </div>
    </div>
  );
};

export default InstallationPage;
