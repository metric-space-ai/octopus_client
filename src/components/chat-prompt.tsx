import {ArrowLongRightIcon, ArrowTrendingUpIcon, PlusIcon} from '@heroicons/react/24/outline';

import {Logo} from './logo';

export const ChatPrompt = () => {
  return (
    <div className='h-full flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-4 max-w-[1136px]'>
        <div className='flex gap-4 items-center'>
          <Logo />
          <h1 className='text-5.5xl font-semibold text-content-black'>Get started:</h1>
        </div>
        <div className='flex gap-4 flex-wrap'>
          <div className='flex-1 flex flex-col p-5 gap-3 bg-white rounded-[20px] overflow-hidden h-[220px] min-w-[240px]'>
            <p className='text-xs font-medium text-content-black'>PROMPT OPTIONS</p>
            <div className='flex justify-between px-4 py-[10px] bg-content-grey-100 rounded-[20px]'>
              <p className='text-xs font-medium text-content-black'>
                Suggest measures to prevent a complex technical problem.
              </p>
              <ArrowLongRightIcon className='w-4 h-4' />
            </div>
            <div className='flex justify-between px-4 py-[10px] bg-content-grey-100 rounded-[20px]'>
              <p className='text-xs font-medium text-content-black'>Explain quantum computing in simple terms.</p>
              <ArrowLongRightIcon className='w-4 h-4' />
            </div>
            <div className='flex justify-between px-4 py-[10px] bg-content-grey-100 rounded-[20px]'>
              <p className='text-xs font-medium text-content-black'>
                Describe the last incident that occurred at work.
              </p>
              <ArrowLongRightIcon className='w-4 h-4' />
            </div>
          </div>
          <div className='relative w-[272px] flex flex-col justify-end p-5 bg-white rounded-[20px] h-[220px]'>
            <div className='absolute right-3 top-3 w-9 h-9 flex items-center justify-center bg-content-accent-hover/10 rounded-[20px]'>
              <ArrowTrendingUpIcon className='w-4 h-4 text-content-accent-hover' />
            </div>
            <div className='text-2xl font-semibold text-content-black'>
              Unlock <span className='text-content-accent-hover'>Efficiency</span> and Be More Productive
            </div>
          </div>
          <div className='relative w-[272px] flex flex-col p-5 h-[220px] bg-prompt-background1 rounded-[20px]'>
            <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
              <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
            </div>
            <p className='text-xs font-medium text-content-white'>WORKING CHECKLIST</p>
            <p className='text-xl font-semibold text-content-white mt-2'>5 Steps to Take First.</p>
          </div>
        </div>
        <div className='flex gap-4 flex-wrap'>
          <div className='relative w-[272px] flex flex-col p-5 h-[220px] bg-prompt-background2 rounded-[20px]'>
            <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
              <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
            </div>
            <p className='text-xs font-medium text-content-white'>GET STARTED</p>
            <p className='text-xl font-semibold text-content-white mt-2'>7 Tips How Work More Effective</p>
          </div>
          <div className='relative flex-1 flex flex-col p-5 h-[220px] bg-auth-background bg-center bg-cover rounded-[20px]'>
            <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
              <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
            </div>
            <p className='text-xs font-medium text-content-white'>INSTRUCTION</p>
            <p className='text-xl font-semibold text-content-white mt-2'>
              Utilizing the Octopus for Factory Work Assistance
            </p>
          </div>
          <div className='relative w-[272px] flex flex-col p-5 h-[220px] bg-content-accent rounded-[20px]'>
            <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-white rounded-[20px]'>
              <PlusIcon className='w-4 h-4 text-content-black' />
            </div>
            <p className='text-xs font-medium text-content-white'>PERSONAL TICKET</p>
            <p className='text-xl font-semibold text-content-white mt-2'>Create own ticket</p>
            <p className='text-xs font-medium text-content-white mt-[6px]'>
              This chat will have a special color label to distinguish it from other tickets, allowing you to easily
              identify your own ticket.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
