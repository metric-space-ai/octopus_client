/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useRef, useState} from 'react';

import {Popover} from '@headlessui/react';
import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  CheckIcon,
  ClipboardIcon,
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
import {AxiosError} from 'axios';
import classNames from 'classnames';
import Image from 'next/image';
import {toast} from 'react-hot-toast';
import {useDebouncedCallback} from 'use-debounce';

import {APPREQUESTBASEURL, ImagesBaseUrl, LANGUAGES} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import {autoGrowTextArea} from '@/helpers';
import {isLongTextWithoutSpaces} from '@/helpers/textHelper';
import {getChatMessageApi, getChatMessageApplicationCodeApi} from '@/services/chat.service';
import {getWaspAppByIdApi} from '@/services/settings.service';
import {useChatStore} from '@/store';
import {useThemeStore} from '@/store/themeData';
import {IAiFunctionErrorParsed, IChatMessage, IWaspApp} from '@/types';

import AppIframe from './app-iframe';
import {Button, IconButton} from './buttons';
import {FileMarkdownContent} from './file-markdown';
import {MarkdownContent} from './markdown';
import {AlertModal, ProvideFeedbackModal} from './modals';
import {IframeWithSrcDocDialog} from './modals/IframeWithSrcDocDialog';
import {UserImageModal} from './modals/showUserImageModal';
import {TranslatorModal} from './modals/TranslatorModal';
import {SensitiveMarkdownContent} from './sensitive-markdown';
import {AnimateDots, LogoIcon} from './svgs';
import CustomSwitch from './switch/custom-switch';

interface IMessageItem {
  item: IChatMessage;
  changeSafety?: React.Dispatch<React.SetStateAction<boolean>>;
  regenerateResponse: () => void;
  regenerateIsDisabled: boolean;
}

export const MessageItem = ({item, changeSafety, regenerateResponse, regenerateIsDisabled}: IMessageItem) => {
  const {
    editMessage,
    updateMessage,
    deleteMessage,
    enabledContentSafety,
    replaceMessageWithAnonymized,
    replaceMessageWithNotSensitive,
    updateContentSafety,
    checkChatInputIsDisabled,
  } = useChatStore();

  const {user} = useAuthContext();
  const timeoutRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // auto grow input
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputRows, setInputRows] = useState(2);

  const [iframeheight, setIframeheight] = useState('0px');
  const [isEditMode, setIsEditMode] = useState(false);
  const [response, setResponse] = useState(item.response ?? '');
  const [messageText, setMessageText] = useState(item.message);
  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[36]);
  const [loading, setLoading] = useState(item.status === 'Asked');
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);
  const isCurrentUser = item.user_id === user?.user_id;
  const [messageEditable] = useState(!isEditMode && isCurrentUser);
  const disableSaveButton = messageText === item.message;
  const [isSensitive, setIsSensitive] = useState(false);
  const [isFileMessage, setIsFileMessage] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [anonymizedLoading, setAnonymizedLoading] = useState(false);
  const [disableLoading] = useState(false);
  const [sensitiveLoading, setSensitiveLoading] = useState(false);
  const [showUserImageModal, setShowUserImageModal] = useState(false);
  const [iframeWithSrcModal, setIframeWithSrcModal] = useState(false);
  const [waspAppDetails, setWaspAppDetails] = useState<IWaspApp>();
  const [showDeactivateConfirmationModal, setShowDeactivateConfirmationModal] = useState(false);
  const [aiFunctionErrorMessage, setAiFunctionErrorMessage] = useState('');

  const [applicationInnerHTML, setApplicationInnerHTML] = useState('');
  const [hasWaspApp, setHasWaspApp] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const {themeData} = useThemeStore();
  const prevMessage = item.response ?? '';

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

  // const handleDisableInspection = async () => {
  //   if (!user) return;
  //   setDisableLoading(true);
  //   await updateChatMessageApi(item.chat_id, item.id, item.message, true);
  //   // refreshMessage(item.chat_id);
  //   setDisableLoading(false);
  //   updateContentSafetyApi(30, user.user_id);
  // };
  const prepareIfResponseIncludesMessage = () => {
    if (isSensitive && response && messageText.includes(response)) {
      const responseSlices = messageText.split(response);
      return (
        <>
          {responseSlices[0]}
          <span className='text-danger-500'>{response}</span>
          {responseSlices[1]}
        </>
      );
    }
    return messageText;
  };
  const checkItemIsSensitive = () => {
    checkChatInputIsDisabled();

    if (item.is_marked_as_not_sensitive || item.is_anonymized) {
      setIsSensitive(false);
    } else {
      setIsSensitive(item.is_sensitive);
    }
  };

  const handleGetWaspAppDetailById = async (id: string) => {
    try {
      const {status, data} = await getWaspAppByIdApi(id);
      if (status === 200) {
        setWaspAppDetails(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  };

  // auto grow input
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Revert icon back after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isEditMode) measure();
  }, [messageText, isEditMode]);

  useEffect(() => {
    if (item.message) setMessageText(item.message);
    if (item.response) setResponse(item.response);
    if (item.status === 'Asked') {
      setLoading(true);
      const estimationResponseTime = new Date(item.estimated_response_at);
      const now = new Date();
      const diffTime = estimationResponseTime.valueOf() - now.valueOf();
      checkMessageResponse(diffTime);
    }
    if (item.status === 'Answered') {
      setLoading(false);

      checkItemIsSensitive();

      if (item.chat_message_files) {
        setIsFileMessage(item.chat_message_files.length > 0);
      }

      if (item.simple_app_id) {
        handleGetAppCode();
      }

      if (item.wasp_app_id) {
        const {wasp_app_id} = item;
        handleGetWaspAppDetailById(wasp_app_id);
        setHasWaspApp(true);
      } else {
        setHasWaspApp(false);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [item]);

  useEffect(() => {
    if (item.ai_function_error) {
      const errorMessage: IAiFunctionErrorParsed = JSON.parse(item.ai_function_error);
      if (errorMessage.response) {
        setAiFunctionErrorMessage(
          `${errorMessage.response}${
            errorMessage.file_attachments?.[0] && ` - "${errorMessage.file_attachments[0].content}"`
          }`,
        );
      }
      if (errorMessage.error) {
        setAiFunctionErrorMessage(errorMessage.error);
      }
    } else {
      setAiFunctionErrorMessage('');
    }
  }, [item]);

  return (
    <>
      <div className='mt-5 text-between_sm_base'>
        <div className='flex gap-3'>
          <div className='shrink-0 w-12 h-12 flex items-center justify-center bg-grey-900 rounded-full relative'>
            {item.profile?.photo_file_name ? (
              <Image
                width={48}
                height={48}
                src={`${ImagesBaseUrl}public/${item.profile.photo_file_name}`}
                alt={item.profile.name}
                className='rounded-full w-12 h-12 bg-grey-100 cursor-pointer'
                onClick={() => setShowUserImageModal(true)}
                title={item.profile.name}
              />
            ) : (
              <UserIcon className='w-9 h-9 text-grey-100' />
            )}
            {user?.user_id === item.user_id && (
              <>
                {item.is_anonymized ? (
                  <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-grey-0 rounded-full'>
                    <SparklesIcon width={14} height={14} className='text-primary' />
                  </div>
                ) : item.is_marked_as_not_sensitive ? (
                  <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-grey-0 rounded-full'>
                    <ExclamationTriangleIcon width={14} height={14} className='text-danger-500' />
                  </div>
                ) : (
                  isSensitive && (
                    <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-grey-0 rounded-full'>
                      <ShieldCheckIcon width={14} height={14} className='text-primary' />
                    </div>
                  )
                )}
              </>
            )}
          </div>
          <div className='flex-1 mt-1'>
            <div className='flex gap-1 [&_.user-profile-name]:opacity-0 [&:hover_.user-profile-name]:opacity-100 relative items-start'>
              {item.profile?.name && (
                <p className='text-xs font-semibold p-2 pl-0 rounded-xl user-profile-name absolute -top-6 transition-opacity text-grey-800'>
                  {item.profile.name}
                </p>
              )}
              {isEditMode ? (
                <textarea
                  ref={inputRef}
                  className='w-full border py-[10px] pr-[90px] pl-[14px] rounded-sm resize-none outline-none focus:border-grey-900'
                  value={messageText}
                  onInput={(e) => setMessageText(e.currentTarget.value)}
                  rows={inputRows}
                />
              ) : (
                <div className='flex flex-col gap-1'>
                  <span className='whitespace-pre-wrap text-base leading-6 text-grey-900 break-word-break'>
                    {prepareIfResponseIncludesMessage()}
                  </span>
                  {user?.user_id === item.user_id && (
                    <>
                      {item.is_anonymized && (
                        <span className='whitespace-pre-wrap text-xxs text-primary-medium '>{`* Sensitive data  has been replaced by anonymized data`}</span>
                      )}
                      {item.is_marked_as_not_sensitive && (
                        <span className='whitespace-pre-wrap text-xxs text-primary-medium '>{`* marked  as Not Sensitive`}</span>
                      )}
                    </>
                  )}
                </div>
              )}
              {!isEditMode && (
                <div className='flex flex-col lg:flex-row gap-4 ml-auto items-center'>
                  {messageEditable && (
                    <IconButton className='shrink-0 h-5 !p-0' onClick={onEditMessage}>
                      <PencilSquareIcon className='w-5 h-5' />
                    </IconButton>
                  )}

                  <Button
                    variant='outline'
                    title='Regenerate'
                    ariaTitle='Regenerate Response'
                    size='small'
                    fontWeight='light'
                    iconBefore={<ArrowPathIcon className='text-grey-900 w-4 h-4' />}
                    onClick={regenerateResponse}
                    className='h-8 opacity-70 hover:opacity-100 transition-all duration-150 !px-2 w-28'
                    disabled={regenerateIsDisabled}
                  />
                </div>
              )}
            </div>
            {isEditMode && (
              <div className='mt-3 flex gap-2 justify-center'>
                <Button
                  variant='outline'
                  title='Cancel'
                  onClick={() => {
                    setIsEditMode(false);
                    setMessageText(item.message);
                  }}
                />
                <Button title='Save changes' disabled={disableSaveButton} onClick={onSaveChangeMessage} />
              </div>
            )}
          </div>
        </div>
        <div className='mt-3 flex gap-3'>
          <div>
            <div
              className={`relative w-12 h-12 flex items-center justify-center rounded-full ${
                isSensitive && !item.is_marked_as_not_sensitive ? 'bg-danger-500/10' : 'bg-grey-0 dark:bg-grey-900'
              }`}
            >
              {
                isSensitive && !item.is_marked_as_not_sensitive && !item.is_anonymized ? (
                  <ShieldCheckIcon width={20} height={20} className='text-danger-500' />
                ) : themeData?.content.chat_logo ? (
                  <Image
                    width={themeData.content.chat_logo.width}
                    height={themeData.content.chat_logo.width}
                    // src={"https://static.harting.com/assets/logo.png"}
                    src={themeData.content.chat_logo.url}
                    alt={themeData.content.chat_logo.alt ?? 'logo'}
                    className='w-full object-contain bg-grey-0 rounded-full'
                  />
                ) : (
                  <LogoIcon width={28} height={18} color='#F5F5F5' />
                )

                // <div className='w-5 h-5 absolute flex items-center justify-center right-0 bottom-0 bg-grey-0 rounded-full'>
                //   <ShieldCheckIcon width={14} height={14} className='text-danger-500' />
                // </div>
              }
            </div>
          </div>

          {/* <div
            className={classNames(
              `flex-1 py-4 px-5 rounded-xl rounded-tl-none flex flex-col`,
              hasWaspApp ? 'bg-grey-100 border' : 'bg-grey-0 dark:bg-grey-900',
            )}
            style={{backgroundColor: item.color ?? ''}}
          >
            <iframe
              className='w-full custom-scrollbar-thumb h-[650px]'
              src={`http://localhost:3000/?messageId=${item.id}`}
            />
          </div> */}
          <div
            className={classNames(
              `flex-1 py-4 px-5 rounded-xl rounded-tl-none flex flex-col`,
              hasWaspApp ? 'bg-grey-100 border' : 'bg-grey-0 dark:bg-grey-900',
            )}
            style={{backgroundColor: item.color ?? ''}}
          >
            {hasWaspApp && item.wasp_app_id && (
              <AppIframe
                src={`${APPREQUESTBASEURL}api/v1/wasp-apps/${item.wasp_app_id}/${item.id}/proxy-frontend/?messageId=${item.id}`}
                loadingTitle='the app is loading'
                bgColor={item.color ?? '#F5F5F5'}
                waspInfo={waspAppDetails}
                messageId={item.id}
                waspAppId={item.wasp_app_id}
              />
            )}

            {loading && <AnimateDots className='dark:fill-grey-0 fill-grey-600' />}

            {!loading && (
              <>
                {!isSensitive || item.is_marked_as_not_sensitive || item.is_anonymized ? (
                  <>
                    {applicationInnerHTML ? (
                      <div className='relative'>
                        {!iframeWithSrcModal && (
                          <>
                            <iframe
                              ref={iframeRef}
                              style={{height: iframeheight, minHeight: 360}}
                              className={`w-full bg-red text-grey-0 [&_body]:m-0 flex-1`}
                              srcDoc={applicationInnerHTML}
                              // height={iframeheight}
                              onLoad={onLoadPrepareIframe}
                              allow='clipboard-read; clipboard-write'
                            ></iframe>
                            <IconButton
                              className='absolute -bottom-10 left-0 rounded-full hover:bg-grey-50'
                              onClick={() => setIframeWithSrcModal(true)}
                            >
                              <ArrowsPointingOutIcon className='w-5 h-5 text-grey-400' />
                            </IconButton>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className='flex items-start gap-1'>
                        <MarkdownContent content={response ?? ''} />
                        {response && (
                          <IconButton
                            className='bg-transparent p-0.5 rounded-full hover:bg-grey-600 transition-all duration-200'
                            disabled={isCopied}
                            onClick={handleCopy}
                            title='copy to clipboard'
                          >
                            <div className='relative w-4 h-4 flex items-center justify-center'>
                              <CheckIcon
                                className={classNames(
                                  'absolute text-grey-0 transition-all duration-300',
                                  !isCopied && ' w-0 h-0 opacity-0 scale-0',
                                  isCopied && 'opacity-100 w-4 h-4 scale-100',
                                )}
                                width={16}
                                height={16}
                              />

                              <ClipboardIcon
                                className={classNames(
                                  'absolute text-grey-0 transition-all duration-300 ',
                                  isCopied && ' w-0 h-0 opacity-0 scale-0',
                                  !isCopied && 'opacity-100 w-4 h-4 scale-100',
                                )}
                                width={16}
                                height={16}
                              />
                            </div>
                          </IconButton>
                        )}
                      </div>
                    )}
                    {isFileMessage && (
                      <FileMarkdownContent
                        mediaFiles={item.chat_message_files}
                        title={item.message}
                        messageId={item.id}
                      />
                    )}
                  </>
                ) : (
                  <div className='flex-1'>
                    <div className=' flex justify-between'>
                      <div className='text-danger-300 text-sm mb-3'>
                        Sensitive content is detected. Chat temporarily blocked for safety.
                      </div>
                      <div>
                        <Popover className={'relative'}>
                          <Popover.Button>
                            <InformationCircleIcon className='w-4 h-4 text-grey-400 hover:text-grey-800 transition-all cursor-pointer' />
                          </Popover.Button>
                          <Popover.Panel
                            className={
                              'bg-grey-800 py-3 px-8 absolute shadow-md shadow-grey-900 rounded-xl w-[280px] -right-8 top-3'
                            }
                          >
                            <p className='text-grey-0 text-xxs font-light'>
                              Content Safety found sensitive information in the message, which included a password.
                            </p>
                          </Popover.Panel>
                        </Popover>
                      </div>
                    </div>
                    <SensitiveMarkdownContent content={item.response ?? ''} />
                  </div>
                )}
                {aiFunctionErrorMessage && (
                  <div
                    className={classNames(
                      'text-danger-300 text-base mb-3',
                      isLongTextWithoutSpaces(aiFunctionErrorMessage, 50) && 'break-all',
                    )}
                  >
                    {aiFunctionErrorMessage}
                  </div>
                )}
              </>
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
                          <p className='text-secondary-600'>View original</p>
                        </Popover.Button>
                        <Popover.Panel
                          className={
                            'bg-grey-800 py-3 px-8 absolute shadow-md shadow-grey-900 rounded-xl w-[260px] -right-8 top-3 flex flex-col gap-3 z-20'
                          }
                        >
                          <div className='flex justify-between items-center'>
                            <div className='flex gap-1 items-center'>
                              <LanguageIcon width={18} height={18} className='text-grey-0' />
                              <p className='font-semibold text-grey-100 text-xs'>Translation on</p>
                            </div>
                            <CustomSwitch active={showOriginal} onChange={handleOriginalOne} />
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-grey-400 text-xs'>Translation language</span>
                            <p
                              className='text-grey-100 hover:text-grey-0 underline text-xs cursor-pointer'
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
                    <LanguageIcon className='w-5 h-5 text-grey-400' />
                  </IconButton>
                  <div className='w-[1px] h-5 bg-grey-600' />
                  <IconButton className='!p-0'>
                    <SpeakerWaveIcon className='w-5 h-5 text-grey-400' />
                  </IconButton>
                  <div className='w-[1px] h-5 bg-grey-600' />
                  <IconButton className='!p-0' onClick={() => setShowProvideFeedbackModal(true)}>
                    <HandThumbDownIcon className='w-5 h-5 text-grey-400' />
                  </IconButton>
                </div>
              ) : (
                <>
                  <div className='mt-4 flex justify-start flex-wrap items-start gap-3'>
                    <IconButton
                      variant='secondary'
                      onClick={handleNoSensitiveData}
                      className='bg-grey-800 rounded-full py-2 px-4 flex items-center'
                      loading={sensitiveLoading}
                      disabled={sensitiveLoading}
                    >
                      <NoSymbolIcon className='w-4 h-4 text-grey-0' />
                      <span className='text-[13px] leading-4 text-center text-grey-0'>No Sensitive Data</span>
                    </IconButton>

                    <IconButton
                      variant='secondary'
                      className='bg-grey-800 rounded-full py-2 px-4 flex items-center'
                      onClick={handleDeleteSensData}
                      loading={deleteLoading}
                      disabled={deleteLoading}
                    >
                      <TrashIcon className='w-4 h-4 text-grey-0' />
                      <span className='text-[13px] leading-4 text-center text-grey-0'>Remove Data</span>
                    </IconButton>

                    <IconButton
                      variant='secondary'
                      className={`bg-grey-800 rounded-full py-2 px-4 flex items-center ${
                        item.is_anonymized ? '!cursor-default' : ''
                      }`}
                      onClick={handleAnonymizedData}
                      loading={anonymizedLoading}
                      disabled={anonymizedLoading || item.is_anonymized}
                    >
                      <SparklesIcon className='w-4 h-4 text-grey-0' />
                      <span
                        className={`text-[13px] leading-4 text-center ${
                          item.is_anonymized ? 'text-grey-400 ' : 'text-grey-0'
                        }`}
                      >
                        Replace with anonymized data
                      </span>
                    </IconButton>

                    <IconButton
                      variant='secondary'
                      className={`bg-grey-800 rounded-full py-2 px-4 flex items-center ${
                        !enabledContentSafety ? '!cursor-default' : ''
                      }`}
                      onClick={() => setShowDeactivateConfirmationModal(true)}
                      loading={disableLoading}
                      disabled={disableLoading || !enabledContentSafety}
                    >
                      <ExclamationTriangleIcon className='w-4 h-4 text-grey-0' />
                      <span
                        className={`text-[13px] leading-4 text-center ${
                          !enabledContentSafety ? 'text-grey-400 ' : 'text-grey-0'
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
              className='bg-grey-0'
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
          title={'Are you sure you want to deactivate Content Safety?'}
          description={
            'With this feature disabled, your content will not be checked for sensitive information for the next 30 minutes.'
          }
          open={alertModalOpen}
          confirmTitle={'Deactivate Content Safety'}
          onClose={() => setAlertModalOpen(false)}
        />
        <ProvideFeedbackModal open={showProvideFeedbackModal} onClose={() => setShowProvideFeedbackModal(false)} />
        <TranslatorModal
          open={showTranslatorModal}
          onClose={() => setShowTranslatorModal(false)}
          text={response ?? item.response ?? ''}
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
