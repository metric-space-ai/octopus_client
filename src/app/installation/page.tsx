/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {useEffect, useState} from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/navigation';

import {Logo} from '@/components/logo';
import {Spinner} from '@/components/spinner';
import {paths} from '@/config/path';
import {useAuthContext} from '@/contexts/authContext';

const DynamicInstallationForm = dynamic(async () => (await import('./installationForm')).default, {
  ssr: false,
  loading: () => (
    <Spinner size='medium' className='w-full mt-10 h-full min-h-[334px] flex items-center justify-center' />
  ),
});
const InstallationPage = () => {
  const {setupInfo, onCheckSetup, setupInfoLoading, user} = useAuthContext();
  const [setupRequired, setSetupRequired] = useState(false);

  const router = useRouter();

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
            <DynamicInstallationForm setSetupRequired={setSetupRequired} setupRequired={setupRequired} />
          )}
          <span className='mt-2 text-xs text-grey-600'>Please double-check your information before proceeding.</span>
        </div>
      </div>
    </div>
  );
};

export default InstallationPage;
