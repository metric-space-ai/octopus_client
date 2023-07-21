'use client';

import {useEffect, useRef, useState} from 'react';

import {PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {useDebouncedCallback} from 'use-debounce';

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
        <div className='flex-1 p-5 pb-10 relative overflow-auto' ref={scrollRef}></div>
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
