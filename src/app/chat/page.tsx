'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

import {MicrophoneIcon, PaperAirplaneIcon, ShieldCheckIcon} from '@heroicons/react/24/outline';
import {useDebouncedCallback} from 'use-debounce';

import {IconButton} from '@/components/buttons';
import {ChatPrompt} from '@/components/chat-prompt';
import {Loading} from '@/components/loading';
import {MessageItem} from '@/components/message-item';
import {autoGrowTextArea} from '@/helpers';
import {useScrollToBottom} from '@/hooks';
import {useChatStore} from '@/store';
import {Agents} from '@/components/agents';
import {VoiceChatModal} from '@/components/modals/voiceChatModal';
import {useAuthContext} from '@/contexts/authContext';

const AGENTWIDTH = {expanded: '282px', constricted: '68px'};

export default function ChatPage() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  const [inputIsDisabled, setInputIsDisabled] = useState(false);
  const [expandedAgents, setExpandedAgents] = useState(true);
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
    isSensitiveChecked,
    isSensitiveUserId,
  } = useChatStore();
  const {user} = useAuthContext();

  const {scrollRef, setAutoScroll} = useScrollToBottom();
  const timeoutRef = useRef(0);
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

  const checkMessageResponse = useCallback(
    (chatId: string) => {
      if (chatId) {
        timeoutRef.current = window.setInterval(() => {
          // if (messages.find((message) => message.chat_id === chatId && message.status === 'Asked'))
          refreshMessage(chatId);
        }, 10000);
      }
    },
    [refreshMessage],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);

  useEffect(() => {
    checkMessageResponse(currentTicketId);
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [currentTicketId, checkMessageResponse]);

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const checkChatInputIsDisabled = () => {
    // const isSensitivePresent = messages.some(
    //   (message) =>
    //     (isSensitiveChecked || message.is_sensitive) &&
    //     enabledContentSafety &&
    //     !showChatPrompt &&
    //     isSensitiveUserId === user?.user_id,
    // );
    if (messages.length === 0) return;
    const message = messages[messages.length - 1];
    const isSensitivePresent =
      (isSensitiveChecked || message.is_sensitive) &&
      enabledContentSafety &&
      !showChatPrompt &&
      !message.is_anonymized &&
      !message.is_marked_as_not_sensitive;

    setInputIsDisabled(isSensitivePresent);
  };
  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
    newMessage(userInput, !enabledContentSafety);
    setUserInput('');
    setAutoScroll(true);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      doSubmit(userInput);
      e.preventDefault();
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => setShowWarningSnackBarWhenSafetyDisabled(false), 4000);
    return () => clearTimeout(timeOutId);
  }, [showWarningSnackBarWhenSafetyDisabled]);

  useEffect(() => {
    checkChatInputIsDisabled();
  }, [messages, enabledContentSafety]);

  return (
    <div className='relative flex h-chat-screen-height rounded-bl-20 w-full'>
      <div
        className={`flex flex-col bg-content-grey-100 w-full ${
          expandedAgents ? 'w-[calc(100%-282px)]' : 'w-[calc(100%-68px)]'
        }`}
      >
        {showWarningSnackBarWhenSafetyDisabled && (
          <div
            style={{width: `calc(100% - ${expandedAgents ? '298px' : '84px'})`}}
            className='flex top-2 left-2 bg-content-white text-content-black px-8 py-4 absolute gap-3 rounded-20 shadow-lg z-10'
            role='alert'
            onClick={() => setShowWarningSnackBarWhenSafetyDisabled(false)}
          >
            <ShieldCheckIcon width={20} height={20} className='text-content-red-600' />
            <span className='block sm:inline'>
              Content security is currently disabled. Activate Content Safety to resume protection and ensure
              data privacy.
            </span>
          </div>
        )}

        <div className='flex-1 p-5 pb-2 relative overflow-auto scroll-smooth' ref={scrollRef}>
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
                  <MessageItem key={item.id} item={item} changeSafety={setShowWarningSnackBarWhenSafetyDisabled} />
                ),
            )
          )}
        </div>
        <div className='relative w-full p-5 border-box flex flex-col'>
          <div className='relative flex-1 flex'>
            <IconButton className='absolute left-3 top-[calc(50%-20px)] ' onClick={() => setOpenVoiceChatModal(true)}>
              <MicrophoneIcon className='w-5 h-5 text-content-black' width={20} height={20} />
            </IconButton>
            <textarea
              ref={inputRef}
              // className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-full resize-none outline-none focus:border-content-black'
              className={`w-full border py-4 pr-[90px] pl-14 rounded-[40px] resize-none outline-none focus:border-content-black custom-scrollbar-thumb ${
                inputIsDisabled ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              placeholder='Ask anything'
              onInput={(e) => onInput(e.currentTarget.value)}
              value={userInput}
              onKeyDown={onInputKeyDown}
              onFocus={() => setAutoScroll(true)}
              onBlur={() => setAutoScroll(false)}
              rows={inputRows}
              autoFocus={true}
              disabled={inputIsDisabled}
            />
            <IconButton
              className='absolute right-2 top-[calc(50%-20px)] '
              disabled={inputIsDisabled}
              onClick={() => (inputIsDisabled ? undefined : doSubmit(userInput))}
            >
              <PaperAirplaneIcon className='w-6 h-6 text-content-grey-600' />
            </IconButton>
          </div>
        </div>
      </div>
      <Agents expanded={expandedAgents} setExpanded={setExpandedAgents} />
      {openVoiceChatModal && <VoiceChatModal open={openVoiceChatModal} onClose={() => setOpenVoiceChatModal(false)} />}
    </div>
  );
}
