import React, {useState} from 'react';
import {AnimateDots, LogoIcon} from './svgs';
import {FileMarkdownContent} from './file-markdown';
import {MarkdownContent} from './markdown';
import {
  ExclamationTriangleIcon,
  HandThumbDownIcon,
  InformationCircleIcon,
  LanguageIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SpeakerWaveIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {SensitiveMarkdownContent} from './sensitive-markdown';
import {IconButton} from './buttons';
import {useChatStore} from '@/store';
import {IChatMessage} from '@/types';
import {ProvideFeedbackModal} from './modals';

// type Props = {
//   item: IChatMessage;
// };
const PromptLine = ({desc, when}: {desc: string; when: string}) => {
  const {
    editMessage,
    updateMessage,
    deleteMessage,
    refreshMessage,
    enabledContentSafety,
    changeContentSafteyStatus,
    changeSensitiveStatus,
  } = useChatStore();
  const [isSensitive, setIsSensitive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFileMessage, setIsFileMessage] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  //   const [response, setResponse] = useState(item.response);
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);
  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);

  //   const prevMessage = item.response;

  const handleOriginalOne = async () => {
    setLoading(true);
    // setResponse(prevMessage);
    setLoading(false);
    setShowOriginal(false);
  };
  return (
    <>
      <div className='flex gap-3 w-full text-left'>
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
          {/* {loading ? (
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
          */}

          <MarkdownContent content={desc} />

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
                <p className='text-content-grey-400'>View original</p>
              </div>
            )}
            <IconButton className='!p-0' onClick={() => setShowTranslatorModal(true)}>
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
        </div>
      </div>
      <ProvideFeedbackModal open={showProvideFeedbackModal} onClose={() => setShowProvideFeedbackModal(false)} />
    </>
  );
};

export default PromptLine;
