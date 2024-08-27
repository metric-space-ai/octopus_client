import React, {useState} from 'react';

import {
  CommandLineIcon,
  HandThumbDownIcon,
  LanguageIcon,
  ShieldCheckIcon,
  SpeakerWaveIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import {useChatStore} from '@/store';

import {IconButton} from './buttons';
import {Input} from './input';
import {MarkdownContent} from './markdown';
import {ProvideFeedbackModal} from './modals';
import {LogoIcon} from './svgs';

// type Props = {
//   item: IChatMessage;
// };
const AgentPromptLine = ({desc}: {desc: string}) => {
  const {enabledContentSafety} = useChatStore();

  const [showOriginal, setShowOriginal] = useState(false);
  //   const [response, setResponse] = useState(item.response);

  const [showProvideFeedbackModal, setShowProvideFeedbackModal] = useState(false);
  const [showTextField, setShowTextField] = useState(false);

  //   const prevMessage = item.response;

  const handleOriginalOne = async () => {
    // setLoading(true);
    // // setResponse(prevMessage);
    // setLoading(false);
    setShowOriginal(false);
  };
  return (
    <>
      <div className='flex gap-3 w-full text-left relative'>
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
      <ProvideFeedbackModal open={showProvideFeedbackModal} onClose={() => setShowProvideFeedbackModal(false)} />
    </>
  );
};

export default AgentPromptLine;
