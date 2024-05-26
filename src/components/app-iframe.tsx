import React, {useEffect, useRef, useState} from 'react';
import {AnimateDots} from './svgs';
import {IconButton} from './buttons';
import {IframeWithSrcDialog} from './modals/IframeWithSrcDialog';
import {ArrowsPointingOutIcon, ExclamationCircleIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {IWaspApp} from '@/types';

interface IAppIframeProps {
  src: string;
  loadingTitle: string;
  bgColor?: string;
  waspInfo?: IWaspApp | undefined;
}

const AppIframe = ({src, loadingTitle, bgColor, waspInfo = undefined}: IAppIframeProps) => {
  const waspFrameRef = useRef<HTMLIFrameElement>(null);
  const [appIsLoading, setAppIsLoading] = useState(true);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [height, setHeight] = useState('630px');
  const [iframeWithSrcModal, setIframeWithSrcModal] = useState(false);

  const handleToggleTooltip = () => {
    setOpenTooltip((prev) => !prev);
  };

  const fixFrameHeight = () => {
    console.log('onload is returning');
    setHeight(`${waspFrameRef?.current?.contentWindow?.document.body.scrollHeight ?? 630} + ${24} + px`);
    setAppIsLoading(false);
  };
  const onload = () => {
    setTimeout(() => fixFrameHeight, 5000);
    setAppIsLoading(false);
  };
  useEffect(() => {
    setTimeout(() => fixFrameHeight, 10000);
  }, []);
  return (
    <div className='relative'>
      {appIsLoading && (
        <div className='flex flex-col gap-6 items-center '>
          <h1 className='text-content-white text-xl w-full text-center'>{loadingTitle}</h1>
          <AnimateDots />
        </div>
      )}

      {!iframeWithSrcModal && (
        <div className='relative'>
          {waspInfo && !appIsLoading && (
            <>
              <div className='flex items-center gap-2 mb-4 relative w-fit'>
                <h2 className='text-content-black font-semibold text-xl leading-normal'>{waspInfo.name}</h2>
                <ExclamationCircleIcon
                  className='w-5 h-5 cursor-pointer text-content-grey-900 hover:text-content-accent my-auto relative -top-[1px]'
                  onClick={handleToggleTooltip}
                />
                <div
                  className={classNames(
                    'shadow-[0px_10px_20px_0px] shadow-content-black/5 rounded-20 pl-5 pr-6 py-4 bg-content-white absolute left-[calc(100%_-_20px)] top-8 w-[60vw] max-w-[540px]',
                    openTooltip && 'block',
                    !openTooltip && 'hidden',
                  )}
                >
                  <p className='text-content-black text-sm font-normal '>{waspInfo.description}</p>
                </div>
              </div>
            </>
          )}
          <iframe
            ref={waspFrameRef}
            className={`w-full bg-red bg-content-grey-100 [&_body]:m-0 flex-1 custom-scrollbar-thumb`}
            style={{backgroundColor: bgColor}}
            // src={`http://localhost:3030/chat/setting?menu=sectors`}
            src={src}
            height={height}
            onLoad={onload}
          ></iframe>
        </div>
      )}
      <IconButton
        className='absolute -bottom-10 left-0 rounded-full hover:bg-content-grey-50'
        onClick={() => setIframeWithSrcModal(true)}
      >
        <ArrowsPointingOutIcon className='w-5 h-5 text-content-grey-400' />
      </IconButton>

      <IframeWithSrcDialog
        bgColor={bgColor ?? ''}
        open={iframeWithSrcModal}
        onClose={() => setIframeWithSrcModal(false)}
        src={src}
      />
    </div>
  );
};
export default AppIframe;
