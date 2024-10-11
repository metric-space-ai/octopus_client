import React, {useEffect, useState} from 'react';

import {Popover} from '@headlessui/react';
import {
  CheckIcon,
  ClipboardIcon,
  HandThumbDownIcon,
  InformationCircleIcon,
  LanguageIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';

import {IconButton} from '@/components/buttons';
import {MarkdownContent} from '@/components/markdown';
import {AnimateDots, LogoIcon} from '@/components/svgs';
import {LANGUAGES} from '@/constant';
import {isLongTextWithoutSpaces} from '@/helpers/textHelper';
import {useThemeStore} from '@/store/themeData';
import {IAiFunctionErrorParsed, IChatMessage} from '@/types';

import {FileMarkdownContent} from '../file-markdown';
import {ProvideFeedbackModal} from '../modals';
import {TranslatorModal} from '../modals/TranslatorModal';
import {SensitiveMarkdownContent} from '../sensitive-markdown';
import CustomSwitch from '../switch/custom-switch';

type Props = {
  item: IChatMessage;
};
const AgentPromptLine = ({item}: Props) => {
  const {themeData} = useThemeStore();

  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(item.status === 'Asked');
  const [isFileMessage, setIsFileMessage] = useState(false);
  const [aiFunctionErrorMessage, setAiFunctionErrorMessage] = useState('');
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[36]);
  const [response, setResponse] = useState(item.response ?? '');
  const [isCopied, setIsCopied] = useState(false);

  const prevMessage = item.response ?? '';

  const handleOriginalOne = async () => {
    // setLoading(true);
    setResponse(prevMessage);
    // setLoading(false);
    setShowOriginal(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000); // Revert icon back after 1 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    if (item.status === 'Answered') {
      setLoading(false);
    }
    if (item.chat_message_files) {
      setIsFileMessage(item.chat_message_files.length > 0);
    }

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
      <div className='mt-3 flex gap-3'>
        <div>
          <div
            className={classNames(
              'relative w-12 h-12 flex items-center justify-center rounded-full bg-grey-0 dark:bg-grey-900',
            )}
          >
            {themeData?.content.chat_logo ? (
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
            )}
          </div>
        </div>
        <div
          className={classNames(
            'flex-1 py-4 px-5 rounded-xl rounded-tl-none flex flex-col bg-grey-0 dark:bg-grey-900 text-left',
          )}
          style={{backgroundColor: item.color ?? ''}}
        >
          {loading && <AnimateDots className='dark:fill-grey-0 fill-grey-600' />}

          {!loading && (
            <>
              {!item.is_sensitive || (item.is_sensitive && item.is_marked_as_not_sensitive) || item.is_anonymized ? (
                <>
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
            (!item.is_sensitive ||
              (item.is_sensitive && item.is_marked_as_not_sensitive) ||
              (item.is_anonymized && (
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
              )))}
        </div>
        {/* </div> */}
      </div>
      <ProvideFeedbackModal
        open={showProvideFeedbackModal}
        onClose={() => setShowProvideFeedbackModal(false)}
        message={item}
      />
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
      {/* <div className='flex gap-3 w-full text-left relative'>
        <div>
          <div className='relative w-9 h-9 flex items-center justify-center bg-grey-900 rounded-full'>
            <LogoIcon width={22} height={20} color='#F5F5F5' />

            <div className='bg-[white] rounded-full absolute bottom-[-5px] right-[-5px]'>
              {enabledContentSafety && (
                <div className='p-1'>
                  <ShieldCheckIcon width={15} height={15} color='#DB3A34' />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1 py-4 px-5 bg-grey-900 rounded-xl rounded-tl-none'>
          {loading ? (
            <AnimateDots />
          ) : !isSensitive ? (
            isFileMessage ? (
              <FileMarkdownContent content={item.chat_message_files} />
            ) : (
              //   <MarkdownContent content={response ?? item.response} />
              
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
          
          {showTextField && (
            <div className='flex items-center '>
              <span className='text-grey-400'>{'> '}</span>
              <Input
                className='!text-grey-0 [&_>*]:!bg-transparent [&_>*]:!pl-1 [&_input]:!bg-transparent [&_input]:!placeholder-grey-400 [&_input]:!text-grey-0 px-0 w-full !py-0 mr-9'
                placeholder='Entering new AgentExecutor chain.'
              />
            </div>
          )}
          <MarkdownContent content={desc} />
          {showTextField ? (
            <IconButton className=' !bg-grey-0 absolute top-5 right-5' onClick={() => setShowTextField(!showTextField)}>
              <XMarkIcon className='w-5 h-5 text-grey-900' width={20} height={20} />
            </IconButton>
          ) : (
            <IconButton className=' ml-auto !bg-grey-800 ' onClick={() => setShowTextField(!showTextField)}>
              <CommandLineIcon className='w-5 h-5 text-grey-0' />
            </IconButton>
          )}

          <div className='mt-4 flex justify-end items-center gap-4'>
            {showOriginal && (
              <div
                // className={`${item.chat_message_files.length > 0 ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                // onClick={() => {
                //   item.chat_message_files.length > 0 ? null : handleOriginalOne();
                // }}
                className={`${desc.length > 0 ? '!cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => {
                  desc.length > 0 ? null : handleOriginalOne();
                }}
              >
                <p className='text-grey-400'>View original</p>
              </div>
            )}
            <IconButton className='!p-0'>
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
        </div>
      </div> 
       <ProvideFeedbackModal open={showProvideFeedbackModal} onClose={() => setShowProvideFeedbackModal(false)} /> */}
    </>
  );
};

export default AgentPromptLine;
