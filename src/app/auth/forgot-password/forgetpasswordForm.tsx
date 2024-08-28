import React, {useState} from 'react';

import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {forgotPassword} from '@/services/auth.service';

interface IFormInputs {
  email: string;
}

const ForgetpasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {email} = data;
    setLoading(true);
    forgotPassword(email)
      .then(() => {
        toast.success('We sent a link to the reset password page. Please check your email.');
        router.push('/auth/reset-password');
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.error ?? 'Something went wrong.');
        setLoading(false);
      });
  };
  return (
    <form className='w-full mt-10' onSubmit={handleSubmit(onSubmit)}>
      <Input
        type='email'
        placeholder='Enter your email'
        errors={errors.email && errors.email.message}
        rules={register('email', {
          required: 'This field is required.',
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        })}
      />
      <Button className='mt-6 w-full !h-11 rounded-4xl' loading={loading} title='Reset password' />
    </form>
  );
};

export default ForgetpasswordForm;
