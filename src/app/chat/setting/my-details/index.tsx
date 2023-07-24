'use client';

import {useState} from 'react';

import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {authValidator} from '@/helpers/validators';

interface IFormInputs {
  email: string;
  username: string;
}

const MyDetailPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IFormInputs) => {
    const {email, username} = data;
    // setLoading(true);
    // const variables = {email, password, username};
    // await createUser({variables});
  };

  return (
    <div className='w-full pt-[84px] flex flex-col items-center'>
      <form className='w-[360px] flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          label='Username'
          placeholder='Username'
          errors={errors.username && errors.username.message}
          rules={register('username', authValidator.username)}
        />
        <Input
          type='email'
          label='Email'
          placeholder='Email'
          errors={errors.email && errors.email.message}
          rules={register('email', authValidator.email)}
        />
        <div className='flex justify-between gap-4'>
          <Button className='flex-1' title='Save' />
          <Button variant='outline' className='flex-1' title='Cancel' />
        </div>
      </form>
    </div>
  );
};

export default MyDetailPage;
