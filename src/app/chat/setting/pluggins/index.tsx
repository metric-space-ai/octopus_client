import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import {AddSectorModal} from '@/components/modals/AddSectorsModal';
import PluginsData from './pluginsDetails';

type Props = {};

const Plugins = (props: Props) => {
  const [addPluginsModal, setAddPluginsModal] = useState(false);
  return (
    <>
      <div className='w-full pt-[84px] flex flex-col items-center '>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-20 bg-white'>
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
            <PluginsData />
          </div>
        </div>
      </div>
      <AddSectorModal open={addPluginsModal} onClose={() => setAddPluginsModal(false)} />
    </>
  );
};

export default Plugins;
