import React from 'react';

import {Spinner} from '@/components/spinner';

const InstallationStartedSection = () => {
  return (
    <div className='flex flex-col flex-1 mb-8 w-full px-7'>
      <div className='flex gap-4 items-center justify-center w-full bg-grey-0 rounded-xl p-5 h-full'>
        <div className='scale-150'>
          <Spinner />
        </div>
        <h1 className='flex text-primary text-xxl uppercase font-bold '>Preparing to install the plugin</h1>
      </div>
    </div>
  );
};

export default InstallationStartedSection;
