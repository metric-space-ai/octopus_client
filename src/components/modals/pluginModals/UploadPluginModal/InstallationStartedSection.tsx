import React from 'react';
import {Spinner} from '@/components/spinner';

type Props = {};

const InstallationStartedSection = ({}: Props) => {
  return (
    <div className='flex flex-col flex-1 mb-8 w-full px-7'>
      <div className='flex gap-4 items-center justify-center w-full bg-white rounded-20 p-5 h-full'>
        <div className='scale-150'>
          <Spinner />
        </div>
        <h1 className='flex text-content-accent text-xxl uppercase font-poppins-bold '>
          Preparing to install the plugin
        </h1>
      </div>
    </div>
  );
};

export default InstallationStartedSection;
