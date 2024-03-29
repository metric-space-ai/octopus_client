import {useCallback, useEffect, useRef, useState} from 'react';
import {Popover} from '@headlessui/react';

import {toast} from 'react-hot-toast';

import {
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
  HandThumbDownIcon,
  InformationCircleIcon,
  LanguageIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  StopIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {ShieldCheckIcon} from '@heroicons/react/24/outline';
import {UserIcon} from '@heroicons/react/24/solid';

import {APPREQUESTBASEURL, ImagesBaseUrl, LANGUAGES} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import {
  getChatMessageApplicationCodeApi,
  getChatMessageApi,
  updateChatMessageApi,
  updateContentSafetyApi,
} from '@/services/chat.service';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';

import {Button, IconButton} from './buttons';
import {FileMarkdownContent} from './file-markdown';
import {MarkdownContent} from './markdown';
import {AlertModal, ProvideFeedbackModal} from './modals';
import {TranslatorModal} from './modals/TranslatorModal';
import {SensitiveMarkdownContent} from './sensitive-markdown';
import {AnimateDots, LogoIcon} from './svgs';
import {AxiosError} from 'axios';

import {UserImageModal} from './modals/showUserImageModal';
import {IframeWithSrcDocDialog} from './modals/IframeWithSrcDocDialog';
import AppIframe from './app-iframe';
import CustomSwitch from './switch/custom-switch';

interface IMessageItem {
  item: IChatMessage;
  changeSafety?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MessageItem = ({item, changeSafety}: IMessageItem) => {
  const {
    editMessage,
    updateMessage,
    deleteMessage,
    refreshMessage,
    enabledContentSafety,
    changeSensitiveStatus,
    changeSensitiveStatusUserId,
    replaceMessageWithAnonymized,
    replaceMessageWithNotSensitive,
    updateContentSafety,
  } = useChatStore();

  const {user} = useAuthContext();
  const timeoutRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeheight, setIframeheight] = useState('0px');
  const [isEditMode, setIsEditMode] = useState(false);
  const [response, setResponse] = useState(item.response);
  const [messageText, setMessageText] = useState(item.message);
  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[36]);
  const [loading, setLoading] = useState(item.status === 'Asked');
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);
  const isCurrentUser = item.user_id === user?.user_id;
  const [messageEditable, setMessageEditable] = useState(!isEditMode && isCurrentUser);
  const disableSaveButton = messageText === item.message;
  const [isSensitive, setIsSensitive] = useState(false);
  const [isFileMessage, setIsFileMessage] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [anonymizedLoading, setAnonymizedLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const [sensitiveLoading, setSensitiveLoading] = useState(false);
  const [showUserImageModal, setShowUserImageModal] = useState(false);
  const [iframeWithSrcModal, setIframeWithSrcModal] = useState(false);
  const [showDeactivateConfirmationModal, setShowDeactivateConfirmationModal] = useState(false);

  const [applicationInnerHTML, setApplicationInnerHTML] = useState('');
  const [hasWaspApp, setHasWaspApp] = useState(false);

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
    setLoading(true);
    setResponse(prevMessage);
    setLoading(false);
    setShowOriginal(false);
  };

  const onLoadPrepareIframe = () => {
    if (iframeRef?.current?.contentWindow) {
      setIframeheight(iframeRef.current.contentWindow.document.body.scrollHeight + 24 + 'px');
    }
  };

  const handleGetAppCode = async () => {
    if (!item.simple_app_id) return;
    try {
      const {status, data} = await getChatMessageApplicationCodeApi(item.simple_app_id);

      if (status === 200) {
        setApplicationInnerHTML(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  };

  const onEditMessage = () => {
    setIsEditMode(true);
    setMessageText(item.message);
  };

  const onSaveChangeMessage = () => {
    // to do
    setLoading(true);
    setIsEditMode(false);
    try {
      editMessage(item, messageText);
    } finally {
      setLoading(false);
      setMessageText(item.message);
    }
  };

  const handleDeleteSensData = async () => {
    setDeleteLoading(true);
    deleteMessage(item);
    setDeleteLoading(false);
  };

  const handleAnonymizedData = async () => {
    setAnonymizedLoading(true);
    replaceMessageWithAnonymized(item.chat_id, item.id);
    setAnonymizedLoading(false);
  };

  const handleNoSensitiveData = async () => {
    setSensitiveLoading(true);
    replaceMessageWithNotSensitive(item.chat_id, item.id);
    // await updateChatMessageApi(item.chat_id, item.id, item.message, true);
    // await newMessage(item.message, true);
    // deleteMessage(item);
    setSensitiveLoading(false);
  };

  const handleDisableInspection = async () => {
    if (!user) return;
    setDisableLoading(true);
    await updateChatMessageApi(item.chat_id, item.id, item.message, true);
    refreshMessage(item.chat_id);
    setDisableLoading(false);
    updateContentSafetyApi(30, user.user_id);
    changeSensitiveStatus(false);
  };
  const prepareIfResponseIncludesMessage = () => {
    if (isSensitive && messageText.includes(response)) {
      const responseSlices = messageText.split(response);
      return (
        <>
          {responseSlices[0]}
          <span className='text-content-red-600'>{response}</span>
          {responseSlices[1]}
        </>
      );
    }
    return messageText;
  };
  const checkItemIsSensitive = () => {
    if (item.is_marked_as_not_sensitive || item.is_anonymized) {
      changeSensitiveStatus(false);
      setIsSensitive(false);
    } else {
      setIsSensitive(item.is_sensitive);
      changeSensitiveStatus(item.is_sensitive);
      changeSensitiveStatusUserId(item.profile.user_id);
    }
    if (item.chat_message_files) {
      setIsFileMessage(item.chat_message_files.length > 0);
    }
  };


  useEffect(() => {
    if (item.status === 'Asked') {
      setLoading(true);
      const estimationResponseTime = new Date(item.estimated_response_at);
      const now = new Date();
      const diffTime = estimationResponseTime.valueOf() - now.valueOf();
      checkMessageResponse(diffTime);
    } else {
      setLoading(false);
      // item.status === 'Answered'
      // update sensitive flag

      checkItemIsSensitive();
    }
    if (item.status === 'Answered' && item.simple_app_id) {
      handleGetAppCode();
    }
    if (item.status === 'Answered' && item.wasp_app_id) {
      setHasWaspApp(true);
    } else {
      setHasWaspApp(false);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <>
      <div className='mt-5 text-between_sm_base'>
        <div className='flex gap-3'>
          <div className='shrink-0 w-12 h-12 flex items-center justify-center bg-content-black rounded-full relative'>
            {item.profile?.photo_file_name ? (
              <img
                src={`${ImagesBaseUrl}public/${item.profile.photo_file_name}`}
                alt={item.profile.name}
                className='rounded-full w-12 h-12 bg-content-grey-100 cursor-pointer'
                onClick={() => setShowUserImageModal(true)}
                title={item.profile.name}
              />
            ) : (
              <UserIcon className='w-9 h-9 text-content-grey-100' />
            )}
            {user?.user_id === item.user_id && (
              <>
                {item.is_anonymized ? (
                  <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-content-white rounded-full'>
                    <SparklesIcon width={14} height={14} className='text-content-accent' />
                  </div>
                ) : item.is_marked_as_not_sensitive ? (
                  <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-content-white rounded-full'>
                    <ExclamationTriangleIcon width={14} height={14} className='text-red-600' />
                  </div>
                ) : (
                  isSensitive && (
                    <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-content-white rounded-full'>
                      <ShieldCheckIcon width={14} height={14} className='text-content-accent' />
                    </div>
                  )
                )}
              </>
            )}
          </div>
          <div className='flex-1 mt-1'>
            <div className='flex gap-1 [&_.user-profile-name]:opacity-0 [&:hover_.user-profile-name]:opacity-100 relative'>
              {item.profile?.name && (
                <p className='text-xs font-poppins-semibold p-2 pl-0 rounded-20 user-profile-name absolute -top-6 transition-opacity text-content-grey-900'>
                  {item.profile.name}
                </p>
              )}
              {isEditMode ? (
                <textarea
                  className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-[10px] resize-none outline-none focus:border-content-black'
                  value={messageText}
                  onInput={(e) => setMessageText(e.currentTarget.value)}
                />
              ) : (
                <div className='flex flex-col gap-1'>
                  <span className='whitespace-pre-wrap text-base leading-6 text-content-black break-word-break'>
                    {prepareIfResponseIncludesMessage()}
                  </span>
                  {user?.user_id === item.user_id && (
                    <>
                      {item.is_anonymized && (
                        <span className='whitespace-pre-wrap text-xxs text-content-accent-hover '>{`* Sensitive data  has been replaced by anonymized data`}</span>
                      )}
                      {item.is_marked_as_not_sensitive && (
                        <span className='whitespace-pre-wrap text-xxs text-content-accent-hover '>{`* marked  as Not Sensitive`}</span>
                      )}
                    </>
                  )}
                </div>
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
            <div
              className={`relative w-12 h-12 flex items-center justify-center rounded-full ${
                isSensitive && !item.is_marked_as_not_sensitive ? 'bg-content-red-600/10' : 'bg-content-black'
              }`}
            >
              {isSensitive && !item.is_marked_as_not_sensitive && !item.is_anonymized ? (
                <ShieldCheckIcon width={20} height={20} className='text-red-600' />
              ) : (
                <LogoIcon width={28} height={18} color='#F5F5F5' />
                // <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-content-white rounded-full'>
                //   <ShieldCheckIcon width={14} height={14} className='text-red-600' />
                // </div>
              )}
            </div>
          </div>
          {/* <div className='flex flex-col'> */}
          {/* <Funding /> */}
          {/* <Research /> */}
          {/* <iframe className='w-full custom-scrollbar-thumb h-[650px]' src='http://localhost:3000/' /> */}
          <div
            className={`flex-1 py-4 px-5 bg-content-black rounded-[20px] rounded-tl-none flex flex-col ${
              // applicationInnerHTML ? `min-h-[${iframeheight}]` :
              ''
            }`}
          >
            {hasWaspApp && <AppIframe src={`${APPREQUESTBASEURL}api/v1/wasp-apps/${item.wasp_app_id}/${item.id}/proxy-frontend`} loadingTitle='the app is loading' />}

            {loading ? (
              <AnimateDots />
            ) : !isSensitive || item.is_marked_as_not_sensitive || item.is_anonymized ? (
              isFileMessage ? (
                <FileMarkdownContent mediaFiles={item.chat_message_files} title={item.message} messageId={item.id}  />
              ) : (
                <>
                  {applicationInnerHTML ? (
                    <div className='relative'>
                      {!iframeWithSrcModal && (
                        <>
                          <iframe
                            ref={iframeRef}
                            style={{height: iframeheight, minHeight: 360}}
                            className={`w-full bg-red text-content-white [&_body]:m-0 flex-1`}
                            srcDoc={applicationInnerHTML}
                            // height={iframeheight}
                            onLoad={onLoadPrepareIframe}
                          ></iframe>
                          <IconButton
                            className='absolute -bottom-10 left-0 rounded-full hover:bg-content-grey-50'
                            onClick={() => setIframeWithSrcModal(true)}
                          >
                            <ArrowsPointingOutIcon className='w-5 h-5 text-content-grey-400' />
                          </IconButton>
                        </>
                      )}
                    </div>
                  ) : (
                    <MarkdownContent content={response} />
                  )}
                </>
              )
            ) : (
              <div className='flex-1'>
                <div className=' flex justify-between'>
                  <div className='text-red-400 text-sm mb-3'>
                    Sensitive content is detected. Chat temporarily blocked for safety.
                  </div>
                  <div>
                    <Popover className={'relative'}>
                      <Popover.Button>
                        <InformationCircleIcon className='w-4 h-4 text-content-grey-400 hover:text-content-white cursor-pointer' />
                      </Popover.Button>
                      <Popover.Panel
                        className={
                          'bg-content-grey-900 py-3 px-8 absolute shadow-md shadow-content-black rounded-20 w-[280px] -right-8 top-3'
                        }
                      >
                        <p className='text-content-white text-xxs font-poppins-light'>
                          Content Safety found sensitive information in the message, which included a password.
                        </p>
                      </Popover.Panel>
                    </Popover>
                  </div>
                </div>
                <SensitiveMarkdownContent content={item.response} />
              </div>
            )}
            {!loading &&
              (!isSensitive || item.is_marked_as_not_sensitive || item.is_anonymized ? (
                <div className='mt-4 flex justify-end items-center gap-4'>
                  {showOriginal && (
                    <div
                    // className={`${item.chat_message_files.length > 0 ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <Popover className={'relative'}>
                        <Popover.Button>
                          <p className='text-content-blue-light'>View original</p>
                        </Popover.Button>
                        <Popover.Panel
                          className={
                            'bg-content-grey-900 py-3 px-8 absolute shadow-md shadow-content-black rounded-20 w-[260px] -right-8 top-3 flex flex-col gap-3 z-20'
                          }
                        >
                          <div className='flex justify-between items-center'>
                            <div className='flex gap-1 items-center'>
                              <LanguageIcon width={18} height={18} className='text-content-white' />
                              <p className='font-semibold text-content-grey-100 text-xs'>Translation on</p>
                            </div>
                            <CustomSwitch active={showOriginal} onChange={(check: boolean) => handleOriginalOne()} />
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-content-grey-400 text-xs'>Translation language</span>
                            <p
                              className='text-content-grey-100 hover:text-content-white underline text-xs cursor-pointer'
                              onClick={() => setShowTranslatorModal(true)}
                            >
                              {selectedLanguage}
                            </p>
                          </div>
                        </Popover.Panel>
                      </Popover>
                    </div>
                  )}
                  <IconButton
                    className='!p-0'
                    onClick={() => setShowTranslatorModal(true)}
                    disabled={item.response ? false : true}
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
                  <div className='mt-4 flex justify-start flex-wrap items-start gap-3'>
                    <IconButton
                      variant='secondary'
                      onClick={handleNoSensitiveData}
                      className='bg-content-grey-900 rounded-full py-2 px-4 flex items-center'
                      loading={sensitiveLoading}
                      disabled={sensitiveLoading}
                    >
                      <NoSymbolIcon className='w-4 h-4 text-content-white' />
                      <span className='text-[13px] leading-4 text-center text-content-white'>No Sensitive Data</span>
                    </IconButton>

                    <IconButton
                      variant='secondary'
                      className='bg-content-grey-900 rounded-full py-2 px-4 flex items-center'
                      onClick={handleDeleteSensData}
                      loading={deleteLoading}
                      disabled={deleteLoading}
                    >
                      <TrashIcon className='w-4 h-4 text-content-white' />
                      <span className='text-[13px] leading-4 text-center text-content-white'>Remove Data</span>
                    </IconButton>

                    <IconButton
                      variant='secondary'
                      className={`bg-content-grey-900 rounded-full py-2 px-4 flex items-center ${
                        item.is_anonymized ? '!cursor-default' : ''
                      }`}
                      onClick={handleAnonymizedData}
                      loading={anonymizedLoading}
                      disabled={anonymizedLoading || item.is_anonymized}
                    >
                      <SparklesIcon className='w-4 h-4 text-content-white' />
                      <span
                        className={`text-[13px] leading-4 text-center ${
                          item.is_anonymized ? 'text-content-grey-400 ' : 'text-content-white'
                        }`}
                      >
                        Replace with anonymized data
                      </span>
                    </IconButton>

                    <IconButton
                      variant='secondary'
                      className={`bg-content-grey-900 rounded-full py-2 px-4 flex items-center ${
                        !enabledContentSafety ? '!cursor-default' : ''
                      }`}
                      onClick={() => setShowDeactivateConfirmationModal(true)}
                      loading={disableLoading}
                      disabled={disableLoading || !enabledContentSafety}
                    >
                      <ExclamationTriangleIcon className='w-4 h-4 text-content-white' />
                      <span
                        className={`text-[13px] leading-4 text-center ${
                          !enabledContentSafety ? 'text-content-grey-400 ' : 'text-content-white'
                        }`}
                      >
                        Stop inspection (30 min)
                      </span>
                    </IconButton>
                  </div>
                </>
              ))}
          </div>
          {/* </div> */}
        </div>
        {isCurrentUser && loading && (
          <div className='mt-4 flex justify-center'>
            <Button
              className='bg-white'
              variant='transparent'
              size='small'
              iconBefore={<StopIcon className='w-4 h-4' />}
              title='Stop generating...'
              onClick={() => deleteMessage(item, false)}
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
          setSelectedLanguage={setSelectedLanguage}
        />
      </div>

      {applicationInnerHTML && (
        <IframeWithSrcDocDialog
          open={iframeWithSrcModal}
          onClose={() => setIframeWithSrcModal(false)}
          srcDoc={applicationInnerHTML}
        />
      )}
      {item.profile?.photo_file_name && (
        <UserImageModal
          imageURL={`${ImagesBaseUrl}public/${item.profile.photo_file_name}`}
          onClose={() => setShowUserImageModal(false)}
          open={showUserImageModal}
        />
      )}
      {showDeactivateConfirmationModal && user && (
        <AlertModal
          headTitle='Disable Content Safety'
          title='Are you sure you want to deactivate Content Safety?'
          description='With this feature disabled, your content will not be checked for sensitive information for the next 30 minutes.'
          confirmTitle='Deactivate Content Safety'
          open={showDeactivateConfirmationModal}
          onConfirm={() => {
            updateContentSafety(30, user.user_id);
            if (changeSafety) {
              changeSafety(true);
            }
            setShowDeactivateConfirmationModal(false);
          }}
          onClose={() => {
            setShowDeactivateConfirmationModal(false);
          }}
        />
      )}
    </>
  );
};
