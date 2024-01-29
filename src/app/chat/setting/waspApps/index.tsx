import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import { UploadWaspAppModal } from '@/components/modals/UploadWaspAppModal';
import WaspAppsDetails from './WaspAppsDetails';

type Props = {};

const WaspApps = (props: Props) => {
  const [openwaspAppModal, setOpenwaspAppModal] = useState(false);
  return (
    <>
      <div className='flex flex-col w-full px-4 py-4'>
        <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
          <h1 className='text-lg leading-7 text-content-black font-poppins-semibold'>Wasp Apps</h1>
          <Button
            className='!px-6 font-poppins-semibold text-sm !h-34-px'
            variant='primary'
            title='Upload Wasp'
            onClick={() => setOpenwaspAppModal(true)}
          />
        </div>
        <div className='max-w-full'>
          <WaspAppsDetails />
        </div>
      </div>
      <UploadWaspAppModal open={openwaspAppModal} onClose={() => setOpenwaspAppModal(false)} />
    </>
  );
};

export default WaspApps;
