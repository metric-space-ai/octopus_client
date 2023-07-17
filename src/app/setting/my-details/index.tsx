'use client';

import {useState} from 'react';

import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {authValidator} from '@/helpers/validators';

interface IFormInputs {
  email: string;
  firstName: string;
  lastName: string;
}

const MyDetailPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IFormInputs) => {
    const {email, firstName, lastName} = data;
    // setLoading(true);
    // const variables = {email, password, username};
    // await createUser({variables});
  };

  return (
    <div className='w-full pt-[84px] flex flex-col items-center'>
      <form className='w-[360px] flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-4'>
          <Input label='First Name' placeholder='First name' />
          <Input label='Last Name' placeholder='Last name' />
        </div>
        <Input
          type='email'
          label='Email'
          placeholder='Email'
          errors={errors.email && errors.email.message}
          rules={register('email', authValidator.email)}
        />
        <div className='flex justify-between gap-4'>
          <Button className='flex-1' title='Save' />
          <Button className='flex-1' title='Cancel' />
        </div>
      </form>
    </div>
  );
};

export default MyDetailPage;
