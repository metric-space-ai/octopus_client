import React from 'react';

import {Dialog} from '@headlessui/react';
import {CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {IconButton} from '@/components/buttons';
import {UPLOADWASPAPPSTEPS} from '@/constant';

type Props = {
  currentStep: number;
  handleCloseModal: () => void;
  updateMode: boolean;
};

const UploadWaspAppModalHeader = ({currentStep, handleCloseModal, updateMode}: Props) => {
  return (
    <div className='flex justify-between items-start mb-16 relative'>
      <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900 text-left absolute left-0 top 0'>
        {updateMode ? `Edit Wasp` : `Upload Wasp`}
      </Dialog.Title>
      <div className='flex mx-auto'>
        <div className='flex text-xs items-center'>
          <div
            className={`flex items-center justify-center rounded-xl px-4 mx-1 h-7 ${
              currentStep >= UPLOADWASPAPPSTEPS.SelectFile
                ? 'bg-primary-400/10 text-primary-medium font-semibold'
                : 'text-grey-600 bg-grey-0 font-light'
            }`}
          >
            <span className='flex gap-1'>
              {currentStep <= UPLOADWASPAPPSTEPS.SelectFile ? (
                '1. Prepare'
              ) : (
                <>
                  <CheckIcon width={16} height={16} />
                  Done
                </>
              )}
            </span>
          </div>
          <span className='w-6 h-1px bg-primary-150' />
          <div
            className={`flex items-center justify-center rounded-xl px-4 mx-1 h-7 ${
              currentStep >= UPLOADWASPAPPSTEPS.Upload
                ? 'bg-primary-400/10 text-primary-medium font-semibold'
                : 'text-grey-600 bg-grey-0 font-light'
            }`}
          >
            <span className='flex gap-1'>
              {currentStep <= UPLOADWASPAPPSTEPS.Upload ? (
                '2. Upload'
              ) : (
                <>
                  <CheckIcon width={16} height={16} />
                  Done
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <IconButton className='absolute top-0 right-1' onClick={handleCloseModal}>
        <XMarkIcon className='w-5 h-5 text-content-primary' />
      </IconButton>
    </div>
  );
};

export default UploadWaspAppModalHeader;
