/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

import {MicrophoneIcon, PaperAirplaneIcon, ShieldCheckIcon} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import {useDebouncedCallback} from 'use-debounce';

import {IconButton} from '@/components/buttons';
import {ChatPrompt} from '@/components/chat-prompt';
import {Loading} from '@/components/loading';
// import {MessageItem} from '@/components/message-item';
import MessageItemSkeleton from '@/components/messageItemSkeleton';
import PluginOperationSelection from '@/components/popover/plugin-operation-selection';
import {useAuthContext} from '@/contexts/authContext';
import {autoGrowTextArea} from '@/helpers';
import {usePageVisibility, useScrollToBottom} from '@/hooks';
import {useChatStore} from '@/store';
// import {Agents} from '@/components/agents';
// import {VoiceChatModal} from '@/components/modals/voiceChatModal';
import {IChatMessage} from '@/types';

const DynamicMessageItem = dynamic(async () => (await import('@/components/message-item')).MessageItem, {
  ssr: false,
  loading: () => <MessageItemSkeleton />,
});
const DynamicAgents = dynamic(async () => (await import('@/components/agents')).Agents, {
  ssr: false,
  loading: () => null,
});
const DynamicVoiceChatModal = dynamic(async () => (await import('@/components/modals/voiceChatModal')).VoiceChatModal, {
  ssr: false,
  loading: () => null,
});

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [expandedAgents, setExpandedAgents] = useState(false);
  const [openVoiceChatModal, setOpenVoiceChatModal] = useState(false);
  const [showWarningSnackBarWhenSafetyDisabled, setShowWarningSnackBarWhenSafetyDisabled] = useState(false);

  const {
    loading,
    currentTicketId,
    isNewTicket,
    messages,
    newMessage,
    refreshMessage,
    enabledContentSafety,
    inputIsDesabled,
    deleteMessage,
  } = useChatStore();
  const {user} = useAuthContext();

  const {scrollRef, setAutoScroll, autoScroll} = useScrollToBottom();

  const showChatPrompt = messages?.length === 0 || isNewTicket;
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

  const isPageVisible = usePageVisibility();

  useEffect(measure, [userInput]);

  // const checkMessageResponse = useCallback(
  //   (chatId: string) => {
  //     if (chatId) {
  //       timeoutRef.current = window.setInterval(() => {
  //         refreshMessage(chatId);
  //       }, 10000);
  //     }
  //   },
  //   [refreshMessage],
  // );
  // useEffect(() => {
  //   checkMessageResponse(currentTicketId);
  //   return () => {
  //     if (timeoutRef.current) {
  //       clearInterval(timeoutRef.current);
  //     }
  //   };
  // }, [currentTicketId, checkMessageResponse]);
  // useEffect(() => {
  //   // Effect to run whenever the page visibility changes
  //   if (isPageVisible && currentTicketId) {
  //     const intervalId = setInterval(() => {
  //       refreshMessage(currentTicketId);
  //     }, 10000);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [isPageVisible, currentTicketId, refreshMessage]);

  const memoizedRefreshMessage = useCallback(() => {
    if (currentTicketId) {
      refreshMessage(currentTicketId);
    }
  }, [currentTicketId, refreshMessage]);

  useEffect(() => {
    if (isPageVisible) {
      const intervalId = setInterval(() => {
        memoizedRefreshMessage();
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [isPageVisible, memoizedRefreshMessage]);

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const checkChatInputIsDisabled = () => {
    if (messages.length === 0) return setInputIsDisabled(false);
    const isSensitivePresent = !showChatPrompt && inputIsDesabled;
    setInputIsDisabled(isSensitivePresent);
  };
  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
    newMessage(userInput, !enabledContentSafety);
    setUserInput('');
    setAutoScroll(true);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSubmit(userInput);
    }
    // if (e.key !== 'Enter') return false;
    // if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    // if (e.altKey || e.ctrlKey || e.shiftKey) {
    //   doSubmit(userInput);
    //   e.preventDefault();
    // }
  };

  const handleRegenerateResponse = (chatItem: IChatMessage) => {
    doSubmit(chatItem.message);
    deleteMessage(chatItem, false);
  };

  useEffect(() => {
    checkChatInputIsDisabled();
  }, [inputIsDesabled, messages]);
  useEffect(() => {
    const timeOutId = setTimeout(() => setShowWarningSnackBarWhenSafetyDisabled(false), 4000);
    return () => clearTimeout(timeOutId);
  }, [showWarningSnackBarWhenSafetyDisabled]);

  useEffect(() => {
    if (autoScroll) {
      setAutoScroll(false);
    }
  }, [autoScroll]);

  useEffect(() => {
    if (messages.length) {
      setAutoScroll(true);
    }
  }, [messages]);

  useEffect(() => {
    if (isNewTicket) {
      setInputIsDisabled(false);
    } else {
      checkChatInputIsDisabled();
    }
  }, [isNewTicket]);

  return (
    <div className='relative flex h-chat-screen-height rounded-bl-xl w-full'>
      <div
        className={`flex flex-col bg-grey-100 w-full ${
          expandedAgents ? 'w-[calc(100%-282px)]' : 'w-[calc(100%-68px)]'
        }`}
      >
        {showWarningSnackBarWhenSafetyDisabled && (
          <div
            style={{width: `calc(100% - ${expandedAgents ? '298px' : '84px'})`}}
            className='flex top-2 left-2 bg-grey-0 text-grey-900 px-8 py-4 absolute gap-3 rounded-xl shadow-lg z-10'
            role='alert'
            onClick={() => setShowWarningSnackBarWhenSafetyDisabled(false)}
          >
            <ShieldCheckIcon width={20} height={20} className='text-danger-500' />
            <span className='block sm:inline'>
              {
                'Content security is currently disabled. Activate Content Safety to resume protection and ensure data privacy.'
              }
            </span>
          </div>
        )}

        <div
          className='flex-1 p-5 pb-2 relative overflow-auto scroll-smooth rounded-r-3xl rounded-bl-lg'
          ref={scrollRef}
        >
          {loading ? (
            <Loading />
          ) : showChatPrompt ? (
            <ChatPrompt handleInputChange={onInput} />
          ) : (
            messages?.map(
              (item) =>
                ((item.is_sensitive && user?.user_id === item.user_id) ||
                  item.is_marked_as_not_sensitive ||
                  item.is_anonymized ||
                  !item.is_sensitive) && (
                  <DynamicMessageItem
                    key={item.id}
                    item={item}
                    changeSafety={setShowWarningSnackBarWhenSafetyDisabled}
                    regenerateResponse={() => handleRegenerateResponse(item)}
                    regenerateIsDisabled={inputIsDisabled}
                  />
                ),
            )
          )}
        </div>
        <div className='relative w-full p-5 border-box flex flex-col'>
          <div className='relative flex-1 flex'>
            <IconButton className='absolute left-3 top-[calc(50%-20px)] ' onClick={() => setOpenVoiceChatModal(true)}>
              <MicrophoneIcon className='w-5 h-5 text-grey-900' width={20} height={20} />
            </IconButton>
            <textarea
              ref={inputRef}
              // className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-full resize-none outline-none focus:border-grey-900'
              className={`w-full border py-4 pr-[90px] pl-14 rounded-4xl resize-none outline-none focus:border-grey-900 custom-scrollbar-thumb ${
                inputIsDisabled ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              placeholder='Ask anything'
              onChange={(e) => onInput(e.currentTarget.value)}
              value={userInput}
              onKeyDown={onInputKeyDown}
              onFocus={() => setAutoScroll(true)}
              onBlur={() => setAutoScroll(false)}
              rows={inputRows}
              autoFocus={true}
              disabled={inputIsDisabled}
            />
            <PluginOperationSelection className='absolute right-12 top-[calc(50%-20px)] flex items-center justify-center p-2 pr-1' />
            <IconButton
              className='absolute right-2 top-[calc(50%-20px)] '
              disabled={inputIsDisabled}
              onClick={() => (inputIsDisabled ? undefined : doSubmit(userInput))}
            >
              <PaperAirplaneIcon className='w-6 h-6 text-grey-600' />
            </IconButton>
          </div>
        </div>
      </div>
      <DynamicAgents expanded={expandedAgents} setExpanded={setExpandedAgents} />
      {openVoiceChatModal && (
        <DynamicVoiceChatModal open={openVoiceChatModal} onClose={() => setOpenVoiceChatModal(false)} />
      )}
    </div>
  );
}
