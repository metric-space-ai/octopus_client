import {IUpdateUserPayload, IUser} from '@/types';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/solid';
import React, {useDeferredValue, useEffect, useState} from 'react';

type Props = {
  currentSize: number | undefined;
  onUpdateProfile: (payload: IUpdateUserPayload) => void;
  user: IUser | null;
};

const SelectBaseFontSize = ({currentSize, onUpdateProfile, user}: Props) => {
  const [openSizeSelector, setOpenSizeSelector] = useState(false);
  const [fontSize, setFontSize] = useState<number>();
  const [selectedFontSize, setSelectedFontSize] = useState(currentSize);
  const deferredValue = useDeferredValue(fontSize);

  const handleUpdateFontSize = (text_size: number) => {
    setFontSize(text_size);
  };

  useEffect(() => {
    if (currentSize) {
      setFontSize(currentSize >= 21 ? 5 : currentSize < 14 ? 1 : currentSize < 16 ? 2 : currentSize < 18 ? 3 : 4);
    }
  }, [currentSize]);

  useEffect(() => {
    setSelectedFontSize(fontSize === 1 ? 11 : fontSize === 2 ? 14 : fontSize === 3 ? 16 : fontSize === 4 ? 18 : 21);
  }, [fontSize]);

  useEffect(() => {
    if (!user || !fontSize || selectedFontSize === currentSize) return;
    const {job_title, language, name} = user;
    const timeOutId = setTimeout(() => onUpdateProfile({text_size: selectedFontSize, job_title, language, name}), 500);
    return () => clearTimeout(timeOutId);
  }, [deferredValue]);

  return (
    <label className='flex flex-col w-full'>
      <p className='mb-2 text-xs'>Text size</p>
      <div className={`bg-white rounded-20 px-6 ${openSizeSelector ? 'pb-6' : ''}`}>
        <div className={`flex items-center w-full h-10 ${openSizeSelector ? 'mb-4' : ''}`}>
          <div
            className={`flex justify-between items-center w-full `}
            onClick={() => setOpenSizeSelector(!openSizeSelector)}
          >
            <p className='cursor-pointer'>
              {fontSize === 1
                ? `Extra Small`
                : fontSize === 2
                ? `small`
                : fontSize === 3
                ? `Standard`
                : fontSize === 4
                ? `Large`
                : `Extra Large`}
            </p>
            {openSizeSelector ? (
              <ChevronUpIcon className='h-5 w-5 text-gray-400 cursor-pointer' aria-hidden='true' />
            ) : (
              <ChevronDownIcon className='h-5 w-5 text-gray-400 cursor-pointer' aria-hidden='true' />
            )}
          </div>
        </div>
        {openSizeSelector && (
          <>
            <div className='min-h-[88px] mb-8'>
              <p style={{fontSize: selectedFontSize}} className={`mb-4 px-1`}>
                Adjust the text size to suit your preference and improve readability. Use the slider below to increase
                or decrease the size of the app content.
              </p>
            </div>
            <div className='w-full relative mb-6'>
              <span className='flex justify-between w-full relative px-3'>
                <span className='absolute bottom-1 w-[calc(100%-24px)] z-0 before:block before:absolute before:w-full before:h-0.5 before:top-1 before:bg-content-grey-400'></span>
                <span className='h-2 w-0.5 bg-content-grey-400 rounded-sm z-0 relative top-1.5'></span>
                <span className='h-2 w-0.5 bg-content-grey-400 rounded-sm z-0 relative top-1.5'></span>
                <span className='h-2 w-0.5 bg-content-grey-400 rounded-sm z-0 relative top-1.5'></span>
                <span className='h-2 w-0.5 bg-content-grey-400 rounded-sm z-0 relative top-1.5'></span>
                <span className='h-2 w-0.5 bg-content-grey-400 rounded-sm z-0 relative top-1.5'></span>
              </span>
              <input
                type='range'
                className='w-full c-slider absolute'
                min={1}
                max={5}
                value={fontSize}
                onChange={(e) => handleUpdateFontSize(+e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </label>
  );
};

export default SelectBaseFontSize;
