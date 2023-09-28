import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import { AddSectorModal } from '@/components/modals/AddSectorsModal';
import SectorsData from './sectorsDetails';

type Props = {};

const Sectors = (props: Props) => {
  const [addSectorsModal, setAddSectorsModal] = useState(false);
  return (
    <>
      <div className='w-full pt-[84px] flex flex-col items-center '>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-20 bg-white'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-content-black font-poppins-semibold'>Sectors</h1>
            <Button
              className='!px-6 font-poppins-semibold text-sm !h-34-px'
              variant='primary'
              title='Add sector'
              onClick={() => setAddSectorsModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <SectorsData/>
          </div>
        </div>
      </div>
      <AddSectorModal  open={addSectorsModal} onClose={() => setAddSectorsModal(false)} />
    </>
  );
};

export default Sectors;
