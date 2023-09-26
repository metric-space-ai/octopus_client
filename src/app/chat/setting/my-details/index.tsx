'use client';

import {useState, useEffect} from 'react';

import {useForm} from 'react-hook-form';

import {Button} from '@/components/buttons';
import {Input} from '@/components/input';
import {authValidator} from '@/helpers/validators';

import WebCamImageTaker from './webcam';

import userImageSample from './../../../../../public/images/user-sample.png';
import {allPropertiesHaveValue} from '@/helpers/allPropertiesHaveValue';
import {useAuthContext} from '@/contexts/authContext';

interface IFormInputs {
  first_name: string;
  last_name: string;
  job_title: string;
  // email: string;
}

const MyDetailPage = () => {
  const form = useForm<IFormInputs>();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = form;

  const {user, onUpdateProfile, loading, onUpdateProfilePicture} = useAuthContext();

  const [takeImageModal, setTakeImageModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [profilePhotoURL, setProfilePhotoURL] = useState('');

  const onSubmit = async (data: IFormInputs) => {
    const {first_name, last_name, job_title} = data;
    // setLoading(true);
    // const variables = {email, password, username};
    // await createUser({variables});
    if (user) {
      onUpdateProfile({
        text_size: user.text_size,
        language: user.language,
        name: `${first_name} ${last_name}`,
        job_title,
      });
    }
  };

  const checkInputsHaveValue = () => {
    setActiveSaveButton(allPropertiesHaveValue(form.getValues()));
  };

  useEffect(() => {
    if (user) {
      //This part is temporary, until the first_name and last_name are separate in the API
      //start
      let fullName = user.name.split(' ', 2);
      if (fullName.length > 1) {
        form.setValue('first_name', fullName[0]);
        form.setValue('last_name', fullName[1]);
      } else {
        form.setValue('first_name', user.name);
      }
      //end
      form.setValue('job_title', user.job_title);
    }
  }, [user]);

  return (
    <>
      <div className='w-full pt-[84px] flex flex-col items-center'>
        <div className='mx-auto mb-8 flex flex-col justify-center'>
          <div className='w-20 h-20 rounded-full overflow-hidden mb-6 mx-auto'>
            <img src={profilePhotoURL ? profilePhotoURL : userImageSample.src} alt='user avatar' className='m-auto' />
          </div>
          <span className=' text-red-600 hover:cursor-pointer hover:underline' onClick={() => setTakeImageModal(true)}>
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
              rules={register('first_name', {...authValidator.first_name, onChange: checkInputsHaveValue})}
            />
            <Input
              label='Last name'
              className='w-full sm:w-1/2 pl-2'
              placeholder='Last name'
              errors={errors.last_name && errors.last_name.message}
              rules={register('last_name', {...authValidator.last_name, onChange: checkInputsHaveValue})}
            />
          </div>
          <div className='mb-8 flex flex-col gap-5'>
            <Input
              label='Job title'
              placeholder='Job title'
              errors={errors.job_title && errors.job_title.message}
              rules={register('job_title', {...authValidator.job_title, onChange: checkInputsHaveValue})}
            />
            {/* <Input
              type='email'
              label='Email'
              placeholder='Email'
              onBlur={checkInputsHaveValue}
              errors={errors.email && errors.email.message}
              rules={register('email', {...authValidator.email,disabled:true})}
            /> */}
          </div>
          <div className='flex justify-between gap-4'>
            <Button type='reset' variant='outline' className='flex-1' title='Cancel' />
            <Button
              loading={loading}
              variant={!activeSaveButton || loading ? 'disabled' : 'primary'}
              className={`${!activeSaveButton || loading ? 'pointer-events-none' : ''} flex-1`}
              title={loading ? '' : 'Save Changes'}
            />
          </div>
        </form>
      </div>

      {takeImageModal && (
        <div className='fixed w-full h-full outline-none left-0 top-0 flex justify-center items-center'>
          <div className='bg-black opacity-50 w-full h-full absolute'></div>

          <div className='min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto rounded-xl border-none bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600 z-50 w-[460px] h-[580px] max-h-[80vh] max-w-full flex flex-col items-center justify-center p-10 bg-white relative'>
            <div className='flex w-full font-semibold flex-shrink-0 items-center justify-between rounded-t-md dark:border-opacity-50 mb-4'>
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
              <WebCamImageTaker
                handleUpload={onUpdateProfilePicture}
                setTakeImageModal={setTakeImageModal}
                setURLAvatar={setProfilePhotoURL}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyDetailPage;
