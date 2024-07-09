'use client';

import {useEffect, useState} from 'react';

import {useRouter} from 'next/navigation';

import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {Logo} from '@/components/logo';
import {authValidator} from '@/helpers/validators';
import {setupApi} from '@/services/auth.service';
import {useAuthContext} from '@/contexts/authContext';
import {paths} from '@/config/path';
import {isAxiosError} from 'axios';
import {Spinner} from '@/components/spinner';

interface IFormInputs {
  email: string;
  company_name: string;
  password: string;
  repeat_password: string;
}

const InstallationPage = () => {
  const {setupInfo, onCheckSetup, setupInfoLoading, onLogout, user} = useAuthContext();
  const [setupRequired, setSetupRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IFormInputs>();

  const handleRedirectUser = () => {
    if (user?.id) {
      router.push(paths.root);
    } else {
      router.push(paths.login);
    }
  };

  useEffect(() => {
    if (!setupInfo && !setupInfoLoading) {
      onCheckSetup();
    }
  }, []);

  useEffect(() => {
    if (setupInfo) {
      const {setup_required, registration_allowed} = setupInfo;
      if (setup_required && registration_allowed) {
        setSetupRequired(true);
      }
      if (!registration_allowed) {
        handleRedirectUser();
      }
    }
  }, [setupInfo]);

  const onSubmit = async (data: IFormInputs) => {
    const {email, company_name, password, repeat_password} = data;
    setLoading(true);
    const payload = {email, company_name, password, repeat_password};
    try {
      const {data, status} = await setupApi(payload);
      if (status === 201) {
        setSetupRequired(false);
        toast.success('Company account registered successfully!.');
        onLogout();
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.error ?? error.message);
      } else {
        toast.error(error.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-full flex flex-col items-center justify-center'>
      <div className='w-full md:w-[940px] py-[64px] flex flex-col items-center justify-center bg-grey-100 rounded-xl'>
        <div className='flex flex-col items-center px-4 w-full sm:w-[640px]'>
          <div className='flex gap-4 mb-4'>
            <h1 className='text-32 font-semibold text-grey-900'>Welcome to Octopus AI</h1>
            <Logo />
          </div>
          <p className='text-sm text-grey-600 text-center mb-10'>
            Welcome to Octopus AI Installation! Simply enter the information below to start using reliable personalized
            AI language model.
          </p>
          {(setupInfoLoading || !setupInfo) && (
            <div className='flex w-full max-w-[370px] py-16 items-center justify-center h-[330px]'>
              <Spinner className='scale-150' />
            </div>
          )}
          {!setupInfoLoading && setupInfo && (
            <form className='max-w-[370px] w-full flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
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
              <span className='text-xxs text-center text-grey-600'>
                Important: Please keep this password as you will need it for login.
              </span>
              <Button
                className='mt-4 w-full !h-11 rounded-4xl'
                disabled={!setupRequired}
                loading={loading}
                title='Install Octopus AI'
              />
            </form>
          )}
          <span className='mt-2 text-xs text-grey-600'>Please double-check your information before proceeding.</span>
        </div>
      </div>
    </div>
  );
};

export default InstallationPage;
