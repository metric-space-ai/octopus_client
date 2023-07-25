'use client';

import {useEffect, useRef, useState} from 'react';

import {PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {useDebouncedCallback} from 'use-debounce';

import {IconButton} from '@/components/buttons';
import {ChatPrompt} from '@/components/chat-prompt';
import {Loading} from '@/components/loading';
import {MessageItem} from '@/components/message-item';
import {autoGrowTextArea} from '@/helpers';
import {useScrollToBottom} from '@/hooks';
import {useChatStore} from '@/store';

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  const {loading, isNewTicket, messages, newMessage} = useChatStore();
  const {scrollRef, setAutoScroll, scrollToBottom} = useScrollToBottom();
  const showChatPrompt = messages.length === 0 || isNewTicket;
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
    newMessage(userInput);
    setUserInput('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      doSubmit(userInput);
      e.preventDefault();
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='relative flex flex-col h-full bg-content-grey-100 rounded-b-[20px]'>
        <div className='flex-1 p-5 pb-10 relative overflow-auto' ref={scrollRef}>
          {loading ? (
            <Loading />
          ) : showChatPrompt ? (
            <ChatPrompt />
          ) : (
            messages.map((item) => <MessageItem key={item.id} item={item} />)
          )}
        </div>
        <div className='relative w-full p-5 border-box flex flex-col'>
          <div className='relative flex-1 flex'>
            <textarea
              ref={inputRef}
              className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-[10px] resize-none outline-none'
              placeholder='Ask anything'
              onInput={(e) => onInput(e.currentTarget.value)}
              value={userInput}
              onKeyDown={onInputKeyDown}
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
