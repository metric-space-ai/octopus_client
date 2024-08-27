/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {useEffect, useState} from 'react';

import {UserIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';
import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {ImagesBaseUrl} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import {authValidator} from '@/helpers/validators';

import WebCamImageTaker from './webcam';

interface IFormInputs {
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
}

const MyDetailPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    setError,
  } = useForm<IFormInputs>();

  const {
    user,
    currentUser,
    onUpdateProfile,
    loading,
    onUpdateProfilePicture,
    getCurrentUser,
    onUpdateSingleUser,
    currentUserCompany,
  } = useAuthContext();

  const [takeImageModal, setTakeImageModal] = useState(false);
  const validateEmailDomain = (value: string, isAdmin: boolean): boolean => {
    if (isAdmin || !currentUserCompany?.allowed_domains || currentUserCompany?.allowed_domains.length === 0)
      return true; // Admins can have any email
    const domain = value.split('@')[1];
    if (currentUserCompany?.allowed_domains) {
      return currentUserCompany.allowed_domains.includes(domain);
    }
    return false;
  };
  const onSubmit = async (data: IFormInputs) => {
    if (!currentUser) return;
    const {first_name, last_name, job_title, email} = data;
    const isValidEmail = validateEmailDomain(
      email,
      currentUser.roles.includes('ROLE_COMPANY_ADMIN_USER') || currentUser.roles.includes('ROLE_ADMIN'),
    );
    if (isValidEmail) {
      if (user) {
        // setLoading(true);
        // const variables = {email, password, username};
        // await createUser({variables});
        onUpdateProfile({
          text_size: user.text_size,
          language: user.language,
          name: `${first_name} ${last_name}`,
          job_title,
        });
      }
      if (currentUser) {
        if (currentUser.email == email) return;
        onUpdateSingleUser({
          email,
          roles: currentUser.roles,
          is_enabled: currentUser.is_enabled,
        });
      }
    } else {
      setError('email', {
        type: 'manual',
        message: `Invalid email domain. valid domains: @${currentUserCompany?.allowed_domains?.join(' , @')}`,
      });
    }
  };

  useEffect(() => {
    if (user) {
      // Split the full name into first and last names
      setValue('job_title', user.job_title); // Set the job title

      const fullName = user.name ? user.name.split(' ') : '';
      if (typeof fullName === 'string') {
        setValue('first_name', user.name); // Set the entire name as first_name if no last name is present
      } else {
        setValue('first_name', fullName.shift() || ''); // Set the first part as first_name
        setValue('last_name', fullName.join(' ')); // Set the remaining parts as last_name
      }
    }
    if (currentUser) {
      setValue('email', currentUser.email); // Set the email
    }
  }, [user, currentUser]);
  useEffect(() => {
    if (!currentUser) getCurrentUser();
  }, []);

  return (
    <>
      <div className='w-full pt-[84px] flex flex-col items-center'>
        <div className='mx-auto mb-8 flex flex-col justify-center'>
          <div className='w-20 h-20 rounded-full overflow-hidden mb-6 mx-auto'>
            {user?.photo_file_name ? (
              <Image
                width={45}
                height={45}
                src={`${ImagesBaseUrl}${user.photo_file_name}`}
                alt={user.name}
                className='m-auto'
                loading='eager'
              />
            ) : (
              <UserIcon className='m-auto' width={45} height={45} />
            )}
          </div>
          <span
            className=' text-danger-500 hover:cursor-pointer hover:underline'
            onClick={() => setTakeImageModal(true)}
          >
            Retake photo
          </span>
        </div>
        <form className='w-[360px] flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-wrap'>
            <Input
              label='First name'
              placeholder='First name'
              className='w-full sm:w-1/2 pr-2'
              errors={errors.first_name && errors.first_name.message}
              rules={register('first_name', {...authValidator.first_name})}
            />
            <Input
              label='Last name'
              className='w-full sm:w-1/2 pl-2'
              placeholder='Last name'
              errors={errors.last_name && errors.last_name.message}
              rules={register('last_name', {...authValidator.last_name})}
            />
          </div>
          <div className='mb-8 flex flex-col gap-5'>
            <Input
              label='Job title'
              placeholder='Job title'
              errors={errors.job_title && errors.job_title.message}
              rules={register('job_title', {...authValidator.job_title})}
            />
            <Input
              type='email'
              label='Email'
              placeholder='Email'
              errors={errors.email && errors.email.message}
              rules={register('email', {
                ...authValidator.email,
                disabled: loading,
              })}
            />
          </div>
          <div className='flex justify-between gap-4'>
            <Button type='reset' variant='outline' className='flex-1' title='Cancel' />
            <Button
              loading={loading}
              variant={loading ? 'disabled' : 'primary'}
              className={classNames(`flex-1`, loading && 'pointer-events-none')}
              title={loading ? '' : 'Save Changes'}
              type='submit'
            />
          </div>
        </form>
      </div>

      {takeImageModal && (
        <div className='fixed w-full h-full outline-none left-0 top-0 flex justify-center items-center'>
          <div className='bg-grey-900 opacity-50 w-full h-full absolute'></div>

          <div className='min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto rounded-md border-none bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600 z-50 w-[460px] h-[580px] max-h-[80vh] max-w-full flex flex-col items-center justify-center p-10 bg-grey-0 relative'>
            <div className='flex w-full font-semibold flex-shrink-0 items-center justify-between rounded-t-xs dark:border-opacity-50 mb-4'>
              <h3
                className='text-2xl font-medium leading-normal text-neutral-800 dark:text-neutral-200'
                id='exampleModalLabel'
              >
                Take a profile photo
              </h3>

              <button
                type='button'
                className='box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none'
                aria-label='Close'
                onClick={() => setTakeImageModal(false)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='relative flex-auto w-full'>
              <WebCamImageTaker handleUpload={onUpdateProfilePicture} setTakeImageModal={setTakeImageModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyDetailPage;
