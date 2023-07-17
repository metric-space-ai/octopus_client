'use client';

import {useState} from 'react';

import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {authValidator} from '@/helpers/validators';

interface IFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const PasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IFormInputs) => {
    const {currentPassword, newPassword, confirmNewPassword} = data;
    // setLoading(true);
    // const variables = {email, password, username};
    // await createUser({variables});
  };

  return (
    <div className='w-full pt-[84px] flex flex-col items-center'>
      <form className='w-[360px] flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input label='Current Password' placeholder='Current Password' />
        <Input label='New Password' placeholder='New Password' />
        <Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password'
          errors={errors.confirmNewPassword && errors.confirmNewPassword.message}
          rules={register('confirmNewPassword', authValidator.password)}
        />
        <div className='flex justify-between gap-4'>
          <Button className='flex-1' title='Save' />
          <Button className='flex-1' title='Cancel' />
        </div>
      </form>
    </div>
  );
};

export default PasswordPage;
