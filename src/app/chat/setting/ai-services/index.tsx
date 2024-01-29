import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import AiServicesData from './ServicesDetails';
import {UploadPluginModal} from '@/components/modals/UploadPluginModal';

type Props = {};

const AiServices = (props: Props) => {
  const [addPluginsModal, setAddPluginsModal] = useState(false);
  return (
    <>
      <div className='flex flex-col w-full px-4 py-4'>
        <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
          <h1 className='text-lg leading-7 text-content-black font-poppins-semibold'>Plugins</h1>
          <Button
            className='!px-6 font-poppins-semibold text-sm !h-34-px'
            variant='primary'
            title='Upload plugin'
            onClick={() => setAddPluginsModal(true)}
          />
        </div>
        <div className='max-w-full'>
          <AiServicesData />
        </div>
      </div>
      <UploadPluginModal open={addPluginsModal} onClose={() => setAddPluginsModal(false)} />
    </>
  );
};

export default AiServices;
