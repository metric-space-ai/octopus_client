'use client';

import {useEffect, useRef, useState} from 'react';

import {ArrowTrendingUpIcon, PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {ArrowLongRightIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';
import {useDebouncedCallback} from 'use-debounce';

import Logo44 from '@/assets/icons/logo-44.png';
import {IconButton} from '@/components/buttons';
import {autoGrowTextArea} from '@/helpers';
import {useScrollToBottom} from '@/hooks';

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  const {scrollRef, setAutoScroll, scrollToBottom} = useScrollToBottom();
  // auto grow input
  const [inputRows, setInputRows] = useState(1);
  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(1, rows));
      setInputRows(inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='relative flex flex-col h-full bg-content-grey-100 rounded-b-[20px]'>
        <div className='flex-1 p-5 pb-10 relative overflow-auto' ref={scrollRef}>
          <div className='h-full flex flex-col justify-center items-center'>
            <div className='flex flex-col gap-4 max-w-[1136px]'>
              <div className='flex gap-4 items-center'>
                <Image src={Logo44} alt='logo' />
                <h1 className='text-44 font-semibold text-content-black'>Get started:</h1>
              </div>
              <div className='flex gap-4 h-[220px]'>
                <div className='flex-1 flex flex-col p-5 gap-3 bg-white rounded-[20px]'>
                  <p className='text-12 font-medium text-content-black'>PROMPT OPTIONS</p>
                  <div className='flex justify-between px-4 py-[10px] bg-content-grey-100 rounded-[20px]'>
                    <p className='text-12 font-medium text-content-black'>
                      Suggest measures to prevent a complex technical problem.
                    </p>
                    <ArrowLongRightIcon className='w-4 h-4' />
                  </div>
                  <div className='flex justify-between px-4 py-[10px] bg-content-grey-100 rounded-[20px]'>
                    <p className='text-12 font-medium text-content-black'>Explain quantum computing in simple terms.</p>
                    <ArrowLongRightIcon className='w-4 h-4' />
                  </div>
                  <div className='flex justify-between px-4 py-[10px] bg-content-grey-100 rounded-[20px]'>
                    <p className='text-12 font-medium text-content-black'>
                      Describe the last incident that occurred at work.
                    </p>
                    <ArrowLongRightIcon className='w-4 h-4' />
                  </div>
                </div>
                <div className='relative w-[272px] flex flex-col justify-end p-5 bg-white rounded-[20px]'>
                  <div className='absolute right-3 top-3 w-9 h-9 flex items-center justify-center bg-content-accent-hover/10 rounded-[20px]'>
                    <ArrowTrendingUpIcon className='w-4 h-4 text-content-accent-hover' />
                  </div>
                  <div className='text-24 font-semibold text-content-black'>
                    Unlock <span className='text-content-accent-hover'>Efficiency</span> and Be More Productive
                  </div>
                </div>
                <div className='relative w-[272px] flex flex-col p-5 bg-prompt-background1 rounded-[20px]'>
                  <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
                    <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
                  </div>
                  <p className='text-12 font-medium text-content-white'>WORKING CHECKLIST</p>
                  <p className='text-20 font-semibold text-content-white'>5 Steps to Take First.</p>
                </div>
              </div>
              <div className='flex gap-4 h-[220px]'>
                <div className='relative w-[272px] flex flex-col p-5 bg-prompt-background2 rounded-[20px]'>
                  <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
                    <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
                  </div>
                  <p className='text-12 font-medium text-content-white'>GET STARTED</p>
                  <p className='text-20 font-semibold text-content-white'>7 Tips How Work More Effective</p>
                </div>
                <div className='relative flex flex-col p-5 bg-auth-background rounded-[20px]'>
                  <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
                    <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
                  </div>
                  <p className='text-12 font-medium text-content-white'>INSTRUCTION</p>
                  <p className='text-20 font-semibold text-content-white'>
                    Utilizing the Octopus for Factory Work Assistance
                  </p>
                </div>
                <div className='relative w-[272px] flex flex-col p-5 bg-content-accent rounded-[20px]'>
                  <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-content-grey-900 rounded-[20px]'>
                    <ArrowLongRightIcon className='w-4 h-4 text-content-white' />
                  </div>
                  <p className='text-12 font-medium text-content-white'>Personal Ticket</p>
                  <p className='text-20 font-semibold text-content-white'>Create own ticket</p>
                  <p className='text-12 font-medium text-content-white'>
                    This chat will have a special color label to distinguish it from other tickets, allowing you to
                    easily identify your own ticket.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative w-full p-5 border-box flex flex-col'>
          <div className='relative flex-1 flex'>
            <textarea
              ref={inputRef}
              className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-[10px] resize-none outline-none'
              placeholder='Ask anything'
              onInput={(e) => onInput(e.currentTarget.value)}
              value={userInput}
              onFocus={() => setAutoScroll(true)}
              onBlur={() => setAutoScroll(false)}
              rows={inputRows}
              autoFocus={true}
            />
            <IconButton className='absolute right-2 top-[2px]' onClick={() => doSubmit(userInput)}>
              <PaperAirplaneIcon className='w-6 h-6 text-content-grey-600' />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
