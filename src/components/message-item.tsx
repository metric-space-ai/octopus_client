import {useCallback, useEffect, useRef, useState} from 'react';

import {
  ExclamationTriangleIcon,
  HandThumbDownIcon,
  InformationCircleIcon,
  LanguageIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  SpeakerWaveIcon,
  StopIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {ShieldCheckIcon} from '@heroicons/react/24/outline';
import {UserIcon} from '@heroicons/react/24/solid';

import {LANGUAGES} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import {deleteChatMessageApi, getChatMessageApi, updateChatMessageApi} from '@/services/chat.service';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';

import {Button, IconButton} from './buttons';
import {FileMarkdownContent} from './file-markdown';
import {MarkdownContent} from './markdown';
import {AlertModal, ProvideFeedbackModal} from './modals';
import {TranslatorModal} from './modals/TranslatorModal';
import {SensitiveMarkdownContent} from './sensitive-markdown';
import {AnimateDots, LogoIcon} from './svgs';

interface IMessageItem {
  item: IChatMessage;
}

export const MessageItem = ({item}: IMessageItem) => {
  const {
    editMessage,
    updateMessage,
    deleteMessage,
    refreshMessage,
    enabledContentSafety,
    changeContentSafteyStatus,
    changeSensitiveStatus,
  } = useChatStore();
  const {user} = useAuthContext();
  const loading = item.status === 'Asked';
  const timeoutRef = useRef(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [response, setResponse] = useState(item.response);
  const [messageText, setMessageText] = useState(item.message);
  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[36]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);
  const isCurrentUser = item.user_id === user?.user_id;
  const messageEditable = !isEditMode && isCurrentUser;
  const disableSaveButton = messageText === item.message;
  const [isSensitive, setIsSensitive] = useState(false);
  const [isFileMessage, setIsFileMessage] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [sensitiveLoading, setSensitiveLoading] = useState(false);

  const prevMessage = item.response;

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

  const handleOriginalOne = async () => {
    setIsLoading(true);
    setResponse(prevMessage);
    setIsLoading(false);
    setShowOriginal(false);
  };

  useEffect(() => {
    if (item.status === 'Asked') {
      const estimationResponseTime = new Date(item.estimated_response_at);
      const now = new Date();
      const diffTime = estimationResponseTime.valueOf() - now.valueOf();
      checkMessageResponse(diffTime);
    } else {
      // item.status === 'Answered'
      // update sensitive flag
      setIsSensitive(item.is_sensitive);
      changeSensitiveStatus(item.is_sensitive);
      setIsFileMessage(item.chat_message_files.length > 0);
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

  const handleDeleteSensData = async () => {
    setDeleteLoading(true);
    // await deleteChatMessageApi(item.chat_id, item.id);
    deleteMessage(item);
    setDeleteLoading(false);
  };

  const handleNoSensitiveData = async () => {
    setSensitiveLoading(true);
    await updateChatMessageApi(item.chat_id, item.id, item.message, true);
    refreshMessage(item.chat_id);
    setSensitiveLoading(false);
  };

  const handleDisableInspection = async () => {
    setDisableLoading(true);
    await updateChatMessageApi(item.chat_id, item.id, item.message, true);
    refreshMessage(item.chat_id);
    setDisableLoading(false);
    changeContentSafteyStatus(false);
    changeSensitiveStatus(false);
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
        <div>
          <div className='relative w-9 h-9 flex items-center justify-center bg-content-black rounded-full'>
            <LogoIcon width={22} height={20} color='#F5F5F5' />

            <div className='bg-[white] rounded-full absolute bottom-[-5px] right-[-5px]'>
              {enabledContentSafety && isSensitive && (
                <div className='p-1'>
                  <ShieldCheckIcon width={15} height={15} color='#DB3A34' />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1 py-4 px-5 bg-content-black rounded-[20px] rounded-tl-none'>
          {loading || isLoading ? (
            <AnimateDots />
          ) : !isSensitive ? (
            isFileMessage ? (
              <FileMarkdownContent content={item.chat_message_files} />
            ) : (
              <MarkdownContent content={response ?? item.response} />
            )
          ) : (
            <div className='flex-1'>
              <div className=' flex justify-between'>
                <div className='text-[#ea6c68] text-[14px] mb-[12px]'>
                  Sensitive content is detected. Chat temporarily blocked for safety.
                </div>
                <div>
                  <InformationCircleIcon
                    className='w-5 h-5 text-[#989898] cursor-pointer'
                    onClick={() => setAlertModalOpen(true)}
                  />
                </div>
              </div>
              <SensitiveMarkdownContent content={item.response} />
            </div>
          )}
          {!loading &&
            (!isSensitive ? (
              <div className='mt-4 flex justify-end items-center gap-4'>
                {showOriginal && (
                  <div
                    className={`${item.chat_message_files.length > 0 ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => {
                      item.chat_message_files.length > 0 ? null : handleOriginalOne();
                    }}
                  >
                    <p className='text-content-grey-400'>View original</p>
                  </div>
                )}
                <IconButton
                  className='!p-0'
                  onClick={() => setShowTranslatorModal(true)}
                  disabled={item.chat_message_files.length > 0 ? true : false}
                >
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
              </div>
            ) : (
              <>
                <div className='mt-4 flex justify-start items-start gap-4'>
                  <IconButton
                    variant='secondary'
                    className='bg-[#2c2c2c] rounded-full py-[8px] px-[16px]'
                    onClick={handleDeleteSensData}
                    loading={deleteLoading}
                    disabled={deleteLoading}
                  >
                    <TrashIcon className='w-5 h-5 text-content-grey-400' />
                    <span className='text-14 text-center text-content-white'>Delete Sensitive Data</span>
                  </IconButton>

                  <IconButton
                    variant='secondary'
                    onClick={handleNoSensitiveData}
                    className='bg-[#2c2c2c] rounded-full py-[8px] px-[16px]'
                    loading={sensitiveLoading}
                    disabled={sensitiveLoading}
                  >
                    <NoSymbolIcon className='w-5 h-5 text-content-grey-400' />
                    <span className='text-14 text-center text-content-white'>No Sensitive Data</span>
                  </IconButton>

                  <IconButton
                    variant='secondary'
                    className='bg-[#2c2c2c] rounded-full py-[8px] px-[16px]'
                    onClick={handleDisableInspection}
                    loading={disableLoading}
                    disabled={disableLoading}
                  >
                    <ExclamationTriangleIcon className='w-5 h-5 text-content-grey-400' />
                    <span className='text-14 text-center text-content-white'>Disabling Inspection (30mins)</span>
                  </IconButton>
                </div>
                <div className='mt-4'>
                  <IconButton
                    variant='secondary'
                    className='bg-[#2c2c2c] rounded-full py-[8px] px-[16px]'
                    onClick={() => {}}
                  >
                    <ShieldExclamationIcon className='w-5 h-5 text-content-grey-400' />
                    <span className='text-14 text-center text-content-white'>
                      Replace with an anonymized version of content
                    </span>
                  </IconButton>
                </div>
              </>
            ))}
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
      <AlertModal
        headTitle={'Disable Content Safety'}
        title={'Are you sure you want to deactivate Content Safety?'}
        description={
          'With this feature disabled, your content will not be checked for sensitive information for the next 30 minutes.'
        }
        open={alertModalOpen}
        confirmTitle={'Deactivate Content Safety'}
        onConfirm={() => {}}
        onClose={() => setAlertModalOpen(false)}
      />
      <ProvideFeedbackModal open={showProvideFeedbackModal} onClose={() => setShowProvideFeedbackModal(false)} />
      <TranslatorModal
        open={showTranslatorModal}
        onClose={() => setShowTranslatorModal(false)}
        text={response ?? item.response}
        setText={setResponse}
        selected={selected}
        setSelected={setSelected}
        setShowOriginal={setShowOriginal}
      />
    </div>
  );
};
