import React, {useState} from 'react';

import {Button} from '@/components/buttons';
import {UploadSimpleAppModal} from '@/components/modals/UploadSimpleAppModal';

import SimpleAppsDetails from './SimpleAppDetails';

const SimpleApps = () => {
  const [openAddHTMLModal, setOpenAddHTMLModal] = useState(false);
  return (
    <>
      <div className='flex flex-col w-full px-4 py-4'>
        <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
          <h1 className='text-lg leading-7 text-grey-900 font-semibold'>HTML</h1>
          <Button
            className='!px-6 font-semibold text-sm !h-34-px'
            variant='primary'
            title='Upload HTML'
            onClick={() => setOpenAddHTMLModal(true)}
          />
        </div>
        <div className='max-w-full'>
          <SimpleAppsDetails />
        </div>
      </div>
      <UploadSimpleAppModal open={openAddHTMLModal} onClose={() => setOpenAddHTMLModal(false)} />
    </>
  );
};

export default SimpleApps;
