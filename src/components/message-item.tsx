import {useCallback, useEffect, useRef, useState} from 'react';

import {
  HandThumbDownIcon,
  LanguageIcon,
  PencilSquareIcon,
  SpeakerWaveIcon,
  StopIcon,
  TrashIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {UserIcon} from '@heroicons/react/24/solid';

import {useAuthContext} from '@/contexts/authContext';
import {getChatMessageApi} from '@/services/chat.service';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';

import {Button, IconButton} from './buttons';
import {MarkdownContent} from './markdown';
import {SensitiveMarkdownContent} from './sensitive-markdown';
import {WarningMarkdownContent} from './warning-markdown';
import {ProvideFeedbackModal} from './modals';
import {AnimateDots, LogoIcon} from './svgs';

interface IMessageItem {
  item: IChatMessage;
}

export const MessageItem = ({item}: IMessageItem) => {
  const {editMessage, updateMessage, deleteMessage} = useChatStore();
  const {user} = useAuthContext();
  const loading = item.status === 'Asked';
  const timeoutRef = useRef(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageText, setMessageText] = useState(item.message);
  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);
  const isCurrentUser = item.user_id === user?.user_id;
  const messageEditable = !isEditMode && isCurrentUser;
  const disableSaveButton = messageText === item.message;
  const [isSensitive, setIsSensitive] = useState(false);

  const checkMessageResponse = useCallback(
    (after: number) => {
      timeoutRef.current = window.setTimeout(() => {
        getChatMessageApi(item.chat_id, item.id).then((res) => {
          if (res.data.status === 'Asked') {
            checkMessageResponse(2000);
          } else {
            updateMessage(res.data);
          }
        });
      }, after);
    },
    [item.chat_id, item.id, updateMessage],
  );

  useEffect(() => {
    if (item.status === 'Asked') {
      const estimationResponseTime = new Date(item.estimated_response_at);
      const now = new Date();
      const diffTime = estimationResponseTime.valueOf() - now.valueOf();
      checkMessageResponse(diffTime);
    } else { // item.status === 'Answered'
      // update sensitive flag
      setIsSensitive(item.is_sensitive)
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [item]);

  const onEditMessage = () => {
    setIsEditMode(true);
    setMessageText(item.message);
  };

  const onSaveChangeMessage = () => {
    // to do
    editMessage(item, messageText);
    setIsEditMode(false);
  };

  return (
    <div className='mt-3 text-15'>
      <div className='flex gap-3'>
        <div className='shrink-0 w-9 h-9 flex items-center justify-center bg-content-black rounded-full'>
          <UserIcon className='w-6 h-6 text-content-grey-100' />
        </div>
        <div className='flex-1 mt-1'>
          <div className='flex gap-1'>
            {isEditMode ? (
              <textarea
                className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-[10px] resize-none outline-none focus:border-content-black'
                value={messageText}
                onInput={(e) => setMessageText(e.currentTarget.value)}
              />
            ) : (
              <span className='whitespace-pre-wrap'>{item.message}</span>
            )}
            {messageEditable && (
              <IconButton className='shrink-0 h-5 !p-0' onClick={onEditMessage}>
                <PencilSquareIcon className='w-5 h-5' />
              </IconButton>
            )}
          </div>
          {isEditMode && (
            <div className='mt-3 flex gap-2 justify-center'>
              <Button variant='outline' title='Cancel' onClick={() => setIsEditMode(false)} />
              <Button title='Save changes' disabled={disableSaveButton} onClick={onSaveChangeMessage} />
            </div>
          )}
        </div>
      </div>
      <div className='mt-3 flex gap-3'>
        <div className='w-9 h-9 flex items-center justify-center bg-content-black rounded-full'>
          <LogoIcon width={22} height={20} color='#F5F5F5' />
        </div>
        <div className='flex-1 py-4 px-5 bg-content-black rounded-[20px] rounded-tl-none'>
          {loading ? <AnimateDots /> :
            !isSensitive?
              <MarkdownContent content={item.response}/> :
              (<div>
                <WarningMarkdownContent content={item.response}/>
              </div>)
          }
          {!loading && (
            !isSensitive?
              <div className='mt-2 flex justify-end items-center gap-4'>
                <IconButton className='!p-0'>
                  <LanguageIcon className='w-5 h-5 text-content-grey-400' />
                </IconButton>
                <div className='w-[1px] h-5 bg-content-grey-600' />
                <IconButton className='!p-0'>
                  <SpeakerWaveIcon className='w-5 h-5 text-content-grey-400' />
                </IconButton>
                <div className='w-[1px] h-5 bg-content-grey-600' />
                <IconButton className='!p-0' onClick={() => setShowProvideFeedbackModal(true)}>
                  <HandThumbDownIcon className='w-5 h-5 text-content-grey-400' />
                </IconButton>
              </div> :
              <div className='mt-2 flex justify-center items-center gap-4'>
                <IconButton className='!p-0'>
                  <TrashIcon className='w-5 h-5 text-content-grey-400' />
                  <span className='text-14 text-center text-content-white'>
                    Delete Sensitive Data
                  </span>
                </IconButton>

                <IconButton className='!p-0'>
                  <NoSymbolIcon className='w-5 h-5 text-content-grey-400' />
                  <span className='text-14 text-center text-content-white'>
                    No Sensitive Data
                  </span>
                </IconButton>

                <IconButton className='!p-0' onClick={() => setShowProvideFeedbackModal(true)}>
                  <ExclamationTriangleIcon className='w-5 h-5 text-content-grey-400' />
                  <span className='text-14 text-center text-content-white'>
                    Disabling Inspection (30mins)
                  </span>
                </IconButton>
            </div>
          )}
        </div>
      </div>
      {isCurrentUser && loading && (
        <div className='mt-4 flex justify-center'>
          <Button
            className='bg-white'
            variant='transparent'
            size='small'
            iconBefore={<StopIcon className='w-4 h-4' />}
            title='Stop generating...'
            onClick={() => deleteMessage(item)}
          />
        </div>
      )}
      <ProvideFeedbackModal open={showProvideFeedbackModal} onClose={() => setShowProvideFeedbackModal(false)} />
    </div>
  );
};
