'use client';

import {useState} from 'react';

import {isAxiosError} from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {useAuthContext} from '@/contexts/authContext';
import {allPropertiesHaveValue} from '@/helpers/allPropertiesHaveValue';
import {authValidator} from '@/helpers/validators';
import {changePassword} from '@/services/auth.service';
import {useAuthStore} from '@/store';

interface IFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const PasswordPage = () => {
  const {onLogout} = useAuthContext();
  const {
    reset,
    register,
    handleSubmit,
    watch,
    getValues,
    formState: {errors},
  } = useForm<IFormInputs>();

  const [loading, setLoading] = useState(false);
  const [activeSaveButton, setActiveSaveButton] = useState(false);

  const {authData} = useAuthStore();

  const onSubmit = async (data: IFormInputs) => {
    const {currentPassword, newPassword} = data;
    if (currentPassword === newPassword)
      return toast.error('The new password cannot be the same as the current password.');
    if (authData) {
      setLoading(true);
      try {
        await changePassword(authData.user_id, currentPassword, newPassword);
        toast.success('Password changed successfully!');
        reset();
        setTimeout(() => onLogout(), 1500);
      } catch (error) {
        console.log({error});
        if (isAxiosError(error)) {
          if (error.response?.status && [403, 401].includes(error.response.status))
            toast.error('The current password is incorrect.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const checkInputsHaveValue = () => {
    setActiveSaveButton(allPropertiesHaveValue(getValues()));
  };

  return (
    <div className='w-full pt-[84px] flex flex-col items-center'>
      <form className='w-[360px] flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        <Input
          type='password'
          label='Current Password'
          placeholder='Current Password'
          errors={errors.currentPassword && 'Password length must be 5, including letter and number.'}
          rules={register('currentPassword', {...authValidator.password, onChange: checkInputsHaveValue})}
        />
        <Input
          type='password'
          label='New Password'
          placeholder='New Password'
          errors={errors.newPassword && errors.newPassword.message}
          rules={register('newPassword', {...authValidator.password, onChange: checkInputsHaveValue})}
        />
        <Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password'
          errors={errors.confirmNewPassword && errors.confirmNewPassword.message}
          rules={register('confirmNewPassword', {
            required: true,
            validate: (val: string) => {
              if (watch('newPassword') !== val) {
                return 'Your password does not match.';
              }
            },
            onChange: checkInputsHaveValue,
          })}
        />
        <div className='flex justify-between gap-4 pt-3'>
          <Button type='reset' variant='outline' className='flex-1' title='Cancel' />
          <Button
            variant={activeSaveButton ? 'primary' : 'disabled'}
            className={`${!activeSaveButton ? 'pointer-events-none' : ''} flex-1`}
            title='Save Changes'
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default PasswordPage;
