'use client';

import React, {useEffect, useRef, useState} from 'react';

import {PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {
  ArrowUturnLeftIcon,
  ChevronDoubleDownIcon,
  Cog8ToothIcon,
  EllipsisHorizontalIcon,
  PauseCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';

import {useScrollToBottom} from '@/hooks';
import {
  BOT_HELLO,
  ChatMessage,
  DEFAULT_TOPIC,
  SubmitKey,
  createMessage,
  useAccessStore,
  useAppConfig,
  useChatStore,
} from '@/store/old';
import {Prompt, usePromptStore} from '@/store/old/prompt';

import {Button, IconButton} from './buttons';
import {Avatar} from './emoji';
import {MaskAvatar} from './mask';
import {ChatControllerPool} from '../client/controller';
import {LAST_INPUT_KEY, Path, REQUEST_TIMEOUT_MS} from '../constant';
import {autoGrowTextArea, copyToClipboard, selectOrCopy, useMobileScreen} from '../helpers';
import {prettyObject} from '../helpers/format';
import Locale from '../locales';

const Markdown = dynamic(async () => (await import('./markdown')).Markdown, {
  loading: () => <EllipsisHorizontalIcon className='text-content-primary w-4 h-4' />,
});

function useSubmitHandler() {
  const config = useAppConfig();
  const submitKey = config.submitKey;

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    return (
      (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
      (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
      (config.submitKey === SubmitKey.Enter && !e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey)
    );
  };

  return {
    submitKey,
    shouldSubmit,
  };
}

function ClearContextDivider() {
  const chatStore = useChatStore();

  return (
    <div onClick={() => chatStore.updateCurrentSession((session) => (session.clearContextIndex = undefined))}>
      <div>{Locale.Context.Clear}</div>
      <div>{Locale.Context.Revert}</div>
    </div>
  );
}

function ChatAction(props: {text: string; icon: JSX.Element; onClick: () => void}) {
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState({
    full: 20,
    icon: 20,
  });

  function updateWidth() {
    if (!iconRef.current || !textRef.current) return;
    const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width;
    const textWidth = getWidth(textRef.current);
    const iconWidth = getWidth(iconRef.current);
    setWidth({
      full: textWidth + iconWidth,
      icon: iconWidth,
    });
  }

  useEffect(() => {
    updateWidth();
  }, []);

  return (
    <div
      className='inline-flex text-12 gap-1 mr-2 mb-1 cursor-pointer'
      onClick={() => {
        props.onClick();
        setTimeout(updateWidth, 1);
      }}
      style={
        {
          '--icon-width': `${width.icon}px`,
          '--full-width': `${width.full}px`,
        } as React.CSSProperties
      }
    >
      <div ref={iconRef} className='flex items-center justify-center'>
        {props.icon}
      </div>
      <div className='flex items-center justify-center' ref={textRef}>
        {props.text}
      </div>
    </div>
  );
}

export function ChatActions(props: {
  showPromptModal: () => void;
  scrollToBottom: () => void;
  showPromptHints: () => void;
  hitBottom: boolean;
}) {
  // stop all responses
  const couldStop = ChatControllerPool.hasPending();
  const stopAll = () => ChatControllerPool.stopAll();

  return (
    <div className='flex'>
      {couldStop && (
        <ChatAction
          onClick={stopAll}
          text={Locale.Chat.InputActions.Stop}
          icon={<PauseCircleIcon className='w-4 h-4 text-content-primary' />}
        />
      )}
      {!props.hitBottom && (
        <ChatAction
          onClick={props.scrollToBottom}
          text={Locale.Chat.InputActions.ToBottom}
          icon={<ChevronDoubleDownIcon className='w-4 h-4 text-content-primary' />}
        />
      )}
      {props.hitBottom && (
        <ChatAction
          onClick={props.showPromptModal}
          text={Locale.Chat.InputActions.Settings}
          icon={<Cog8ToothIcon className='w-4 h-4 text-content-primary' />}
        />
      )}
    </div>
  );
}

export function Chat() {
  type RenderMessage = ChatMessage & {preview?: boolean};

  const chatStore = useChatStore();
  const [session, sessionIndex] = useChatStore((state) => [state.currentSession(), state.currentSessionIndex]);
  const config = useAppConfig();
  const fontSize = config.fontSize;

  const [showExport, setShowExport] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {submitKey, shouldSubmit} = useSubmitHandler();
  const {scrollRef, setAutoScroll, scrollToBottom} = useScrollToBottom();
  const [hitBottom, setHitBottom] = useState(true);
  const isMobileScreen = useMobileScreen();
  const router = useRouter();

  const onChatBodyScroll = (e: HTMLElement) => {
    const isTouchBottom = e.scrollTop + e.clientHeight >= e.scrollHeight - 10;
    setHitBottom(isTouchBottom);
  };

  // prompt hints
  const promptStore = usePromptStore();
  const [promptHints, setPromptHints] = useState<Prompt[]>([]);
  const onSearch = useDebouncedCallback(
    (text: string) => {
      setPromptHints(promptStore.search(text));
    },
    100,
    {leading: true, trailing: true},
  );

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

  // only search prompts when user input is short
  const SEARCH_TEXT_LIMIT = 30;
  const onInput = (text: string) => {
    setUserInput(text);
    const n = text.trim().length;

    // clear search results
    if (n === 0) {
      setPromptHints([]);
    } else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
      // check if need to trigger auto completion
      if (text.startsWith('/')) {
        const searchText = text.slice(1);
        onSearch(searchText);
      }
    }
  };

  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
    setIsLoading(true);
    chatStore.onUserInput(userInput).then(() => setIsLoading(false));
    localStorage.setItem(LAST_INPUT_KEY, userInput);
    setUserInput('');
    setPromptHints([]);
    if (!isMobileScreen) inputRef.current?.focus();
    setAutoScroll(true);
  };

  // stop response
  const onUserStop = (messageId: number) => {
    ChatControllerPool.stop(sessionIndex, messageId);
  };

  useEffect(() => {
    chatStore.updateCurrentSession((session) => {
      const stopTiming = Date.now() - REQUEST_TIMEOUT_MS;
      session.messages.forEach((m) => {
        // check if should stop all stale messages
        if (m.isError || new Date(m.date).getTime() < stopTiming) {
          if (m.streaming) {
            m.streaming = false;
          }

          if (m.content.length === 0) {
            m.isError = true;
            m.content = prettyObject({
              error: true,
              message: 'empty response',
            });
          }
        }
      });

      // auto sync mask config from global config
      if (session.mask.syncGlobalConfig) {
        console.log('[Mask] syncing from global, name = ', session.mask.name);
        session.mask.modelConfig = {...config.modelConfig};
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // check if should send message
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput, fill with last input
    if (e.key === 'ArrowUp' && userInput.length <= 0 && !(e.metaKey || e.altKey || e.ctrlKey)) {
      setUserInput(localStorage.getItem(LAST_INPUT_KEY) ?? '');
      e.preventDefault();
      return;
    }
    if (shouldSubmit(e) && promptHints.length === 0) {
      doSubmit(userInput);
      e.preventDefault();
    }
  };
  const onRightClick = (e: any, message: ChatMessage) => {
    // copy to clipboard
    if (selectOrCopy(e.currentTarget, message.content)) {
      e.preventDefault();
    }
  };

  const findLastUserIndex = (messageId: number) => {
    // find last user input message and resend
    let lastUserMessageIndex: number | null = null;
    for (let i = 0; i < session.messages.length; i += 1) {
      const message = session.messages[i];
      if (message.id === messageId) {
        break;
      }
      if (message.role === 'user') {
        lastUserMessageIndex = i;
      }
    }

    return lastUserMessageIndex;
  };

  const deleteMessage = (userIndex: number) => {
    chatStore.updateCurrentSession((session) => session.messages.splice(userIndex, 2));
  };

  const onDelete = (botMessageId: number) => {
    const userIndex = findLastUserIndex(botMessageId);
    if (userIndex === null) return;
    deleteMessage(userIndex);
  };

  const onResend = (botMessageId: number) => {
    // find last user input message and resend
    const userIndex = findLastUserIndex(botMessageId);
    if (userIndex === null) return;

    setIsLoading(true);
    const content = session.messages[userIndex].content;
    deleteMessage(userIndex);
    chatStore.onUserInput(content).then(() => setIsLoading(false));
    inputRef.current?.focus();
  };

  const context: RenderMessage[] = session.mask.hideContext ? [] : session.mask.context.slice();

  const accessStore = useAccessStore();

  if (context.length === 0 && session.messages.at(0)?.content !== BOT_HELLO.content) {
    const copiedHello = Object.assign({}, BOT_HELLO);
    if (!accessStore.isAuthorized()) {
      copiedHello.content = Locale.Error.Unauthorized;
    }
    context.push(copiedHello);
  }

  useEffect(() => {
    if (!accessStore.isAuthorized()) {
      accessStore.updateToken(process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '');
    }
  }, []);

  // clear context index = context length + index in messages
  const clearContextIndex = (session.clearContextIndex ?? -1) >= 0 ? session.clearContextIndex! + context.length : -1;

  // preview messages
  const messages = context.concat(session.messages as RenderMessage[]).concat(
    isLoading
      ? [
          {
            ...createMessage({
              role: 'assistant',
              content: '……',
            }),
            preview: true,
          },
        ]
      : [],
  );

  const renameSession = () => {
    const newTopic = prompt(Locale.Chat.Rename, session.topic);
    if (newTopic && newTopic !== session.topic) {
      chatStore.updateCurrentSession((session) => (session.topic = newTopic!));
    }
  };

  const autoFocus = !isMobileScreen;

  return (
    <div className='relative flex flex-col h-full bg-content-grey-100 rounded-b-[20px]' key={session.id}>
      <div className='flex px-5 py-[14px] justify-between' data-tauri-drag-region>
        <div className='window-header-title'>
          <div className='text-18 font-medium max-w-[50vw]' onClickCapture={renameSession}>
            {!session.topic ? DEFAULT_TOPIC : session.topic}
          </div>
          <div className='text-14 mt-1'>{Locale.Chat.SubTitle(session.messages.length)}</div>
        </div>
        <div className='flex gap-2'>
          <div className='sm:hidden'>
            <Button
              iconBefore={<ArrowUturnLeftIcon className='text-white' />}
              title={Locale.Chat.Actions.ChatList}
              onClick={() => router.push(Path.Home)}
            />
          </div>
          <div>
            <IconButton variant='secondary' onClick={renameSession}>
              <PencilIcon className='w-4 h-4 text-white' />
            </IconButton>
          </div>
        </div>
      </div>

      <div
        className='flex-1 p-5 pb-10 relative overflow-auto'
        ref={scrollRef}
        onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        onMouseDown={() => inputRef.current?.blur()}
        onWheel={(e) => setAutoScroll(hitBottom && e.deltaY > 0)}
        onTouchStart={() => {
          inputRef.current?.blur();
          setAutoScroll(false);
        }}
      >
        {messages.map((message, i) => {
          const isUser = message.role === 'user';
          const showActions = !isUser && i > 0 && !(message.preview || message.content.length === 0);

          const shouldShowClearContextDivider = i === clearContextIndex - 1;

          return (
            <div key={message.id}>
              <div className={isUser ? 'flex flex-row-reverse' : 'flex'}>
                <div className={classNames('group flex flex-col', isUser && 'items-end')}>
                  <div className='mt-[20px]'>
                    {message.role === 'user' ? <Avatar avatar={config.avatar} /> : <MaskAvatar mask={session.mask} />}
                  </div>
                  <div className='relative max-w-[50vw] border-box mt-[10px] rounded-[10px] bg-border-default p-[10px] border break-words'>
                    {showActions && (
                      <div className='group-hover:opacity-50 absolute min-w-[120px] right-0 top-[-26px] left-[30px] text-12 flex flex-row-reverse opacity-0 gap-1'>
                        {message.streaming ? (
                          <div className='cursor-pointer text-black' onClick={() => onUserStop(message.id ?? i)}>
                            {Locale.Chat.Actions.Stop}
                          </div>
                        ) : (
                          <>
                            <div className='cursor-pointer text-black' onClick={() => onDelete(message.id ?? i)}>
                              {Locale.Chat.Actions.Delete}
                            </div>
                            <div className='cursor-pointer text-black' onClick={() => onResend(message.id ?? i)}>
                              {Locale.Chat.Actions.Retry}
                            </div>
                          </>
                        )}

                        <div className='cursor-pointer text-black' onClick={() => copyToClipboard(message.content)}>
                          {Locale.Chat.Actions.Copy}
                        </div>
                      </div>
                    )}
                    <Markdown
                      content={message.content}
                      loading={(message.preview || message.content.length === 0) && !isUser}
                      onContextMenu={(e) => onRightClick(e, message)}
                      onDoubleClickCapture={() => {
                        if (!isMobileScreen) return;
                        setUserInput(message.content);
                      }}
                      fontSize={fontSize}
                      parentRef={scrollRef}
                      defaultShow={i >= messages.length - 10}
                    />
                  </div>
                  {!isUser && !message.preview && (
                    <div className='flex flex-row-reverse border-box pt-[5px] text-12'>
                      <div className='text-content-secondary'>{message.date.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
              {shouldShowClearContextDivider && <ClearContextDivider />}
            </div>
          );
        })}
      </div>

      <div className='relative w-full p-5 border-box flex flex-col'>
        <ChatActions
          showPromptModal={() => null}
          scrollToBottom={scrollToBottom}
          hitBottom={hitBottom}
          showPromptHints={() => {
            // Click again to close
            if (promptHints.length > 0) {
              setPromptHints([]);
              return;
            }

            inputRef.current?.focus();
            setUserInput('/');
            onSearch('');
          }}
        />
        <div className='relative flex-1 flex'>
          <textarea
            ref={inputRef}
            className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-[10px] resize-none outline-none'
            placeholder={Locale.Chat.InputPlaceholder}
            onInput={(e) => onInput(e.currentTarget.value)}
            value={userInput}
            onKeyDown={onInputKeyDown}
            onFocus={() => setAutoScroll(true)}
            onBlur={() => setAutoScroll(false)}
            rows={inputRows}
            autoFocus={autoFocus}
            style={{
              fontSize: config.fontSize,
            }}
          />
          <IconButton className='absolute right-2 top-[2px]' onClick={() => doSubmit(userInput)}>
            <PaperAirplaneIcon className='w-6 h-6 text-content-grey-600' />
          </IconButton>
        </div>
      </div>

      {showExport && <div onClick={() => setShowExport(false)} />}
    </div>
  );
}
