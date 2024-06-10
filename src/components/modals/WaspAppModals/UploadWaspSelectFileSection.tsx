import React, {Fragment, useState, useEffect, useRef, ChangeEvent, DragEvent} from 'react';
import {Dialog} from '@headlessui/react';

import {IconButton} from '@/components/buttons';

import {ArrowUpTrayIcon, CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';

import {TPluginStatus} from '@/types';
import {UPLOADWASPAPPSTEPS, VALIDWASPFILE} from '@/constant';
import toast from 'react-hot-toast';
import {bytesCalculator} from '@/helpers';

type Props = {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileIsSelected: boolean;
  file: File | null;
  uploadPercentage: number;
  initialFileStarted: boolean;
};

const UploadWaspSelectFileSection = ({setFile, fileIsSelected, file, uploadPercentage, initialFileStarted}: Props) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleDeleteFile = () => {
    setFile(null);
  };
  const handleCheckFileIsValid = (file: File) => {
    if (VALIDWASPFILE.Types.includes(file.type)) {
      setFile(file);
    } else {
      toast.error(`Mime of selected file is unacceptable`);
    }
  };

  const handleDragFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDropFiles = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleCheckFileIsValid(e.dataTransfer.files[e.dataTransfer.files.length - 1]);
    console.log({
      file: e.dataTransfer.files[e.dataTransfer.files.length - 1],
      type: e.dataTransfer.files[e.dataTransfer.files.length - 1].type,
    });
  };
  const handleCustomSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      console.log({e, file: e.target.files[e.target.files.length - 1]});
      handleCheckFileIsValid(e.target.files[e.target.files.length - 1]);
    }
  };
  return (
    <div className=' flex flex-col '>
      <div
        onDrop={(e) => handleDropFiles(e)}
        onDragOver={handleDragFiles}
        className='flex flex-col item-center justify-center w-full min-h-[188px] px-4 py-11 mb-6
                        bg-grey-0 border-2 border-primary border-dashed rounded-xl '
      >
        <IconButton
          className='top-4 right-4 block mx-auto primary-soft/15 mb-5'
          onClick={(e) => {
            e.preventDefault();
            inputFileRef.current?.click();
          }}
        >
          <ArrowUpTrayIcon className='text-primary-medium' width={20} height={20} />
        </IconButton>
        <h6 className='font-semibold text-sm text-grey-800 mb-3'>Drag & drop file to upload</h6>
        <p className='text-xs text-grey-600 '>Files in .zip file format only</p>
        <input
          type='file'
          className='hidden'
          hidden
          accept='.zip'
          ref={inputFileRef}
          onChange={(e) => handleCustomSelectFile(e)}
        />
      </div>
      {fileIsSelected && !!file && (
        <div className='flex flex-wrap py-3 px-6 bg-grey-0 rounded-xl w-full items-center justify-between relative'>
          <div className='flex gap-4 items-center max-w-full'>
            <div className='flex w-56 pr-2 items-center'>
              <p className='font-semibold text-xs text-grey-900 truncate ... max-w-[calc(100%-36px)]'>
                {file.name}
              </p>
            </div>
            <span className='text-xs text-grey-600 lg:w-24 ml-auto lg:ml-0 text-center'>
              {bytesCalculator(file.size)}
            </span>
          </div>
          <div className='flex justify-end items-center gap-6'>
            {initialFileStarted && (
              <div className='flex items-center gap-2 max-w-full'>
                <div className='h-1.5 bg-grey-100 dark:bg-neutral-600 w-[140px] '>
                  <div className='h-1.5 bg-primary transition-all' style={{width: `${uploadPercentage}%`}}></div>
                </div>
                <span className='text-grey-900 text-xs font-medium tracking-[-1px] flex items-center'>
                  {`${uploadPercentage} %`}
                </span>
              </div>
            )}
            <IconButton className='!p-0' onClick={handleDeleteFile}>
              <XMarkIcon className='w-5 h-5 text-content-primary' />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWaspSelectFileSection;
