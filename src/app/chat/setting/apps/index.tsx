import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import AppsData from './appDetails';
import { UploadAppModal } from '@/components/modals/UploadAppModal';

type Props = {};

const Applications = (props: Props) => {
  const [addAppsModal, setAddAppsModal] = useState(false);
  return (
    <>
      <div className='w-full pt-[84px] flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-20 bg-white'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-content-black font-poppins-semibold'>Apps</h1>
            <Button
              className='!px-6 font-poppins-semibold text-sm !h-34-px'
              variant='primary'
              title='Upload New App'
              onClick={() => setAddAppsModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <AppsData />
          </div>
        </div>
      </div>
      <UploadAppModal open={addAppsModal} onClose={() => setAddAppsModal(false)} />
    </>
  );
};

export default Applications;
