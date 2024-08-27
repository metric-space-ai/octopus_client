'use client';

import {Dispatch, SetStateAction, useState} from 'react';

import {isAxiosError} from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {useAuthContext} from '@/contexts/authContext';
import {authValidator} from '@/helpers/validators';
import {setupApi} from '@/services/auth.service';

interface IFormInputs {
  email: string;
  company_name: string;
  password: string;
  repeat_password: string;
}
type Props = {
  setupRequired: boolean;
  setSetupRequired: Dispatch<SetStateAction<boolean>>;
};
const InstallationForm = ({setupRequired, setSetupRequired}: Props) => {
  const [loading, setLoading] = useState(false);
  const {onLogout} = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {email, company_name, password, repeat_password} = data;
    setLoading(true);
    const payload = {email, company_name, password, repeat_password};
    try {
      const {status} = await setupApi(payload);
      if (status === 201) {
        setSetupRequired(false);
        toast.success('Company account registered successfully!.');
        onLogout();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.error ?? error.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
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
  );
};

export default InstallationForm;
