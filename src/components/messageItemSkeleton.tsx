import React from 'react';

const MessageItemSkeleton = () => {
  return (
    <div className='flex flex-col mt-5 text-between_sm_base w-full animate-pulse'>
      <div className='flex gap-3 w-3/4'>
        <div className='shrink-0 w-12 h-12 flex bg-grey-50 dark:bg-grey-400 rounded-full' />
        <div className='flex-1 mt-1 w-3/4 h-7 bg-grey-50 dark:bg-grey-400' />
      </div>
      <div className='mt-3 flex gap-3 w-full'>
        <div className='shrink-0 w-12 h-12 flex bg-grey-50 dark:bg-grey-400 rounded-full' />
        <div className='flex-1 py-4 px-5 rounded-xl rounded-tl-none flex flex-col bg-grey-50 dark:bg-grey-400 w-full' />
      </div>
    </div>
  );
};

export default MessageItemSkeleton;
