import React, {useEffect, useRef, useState} from 'react';
import {AnimateDots} from './svgs';
import {IconButton} from './buttons';
import {IframeWithSrcDialog} from './modals/IframeWithSrcDialog';
import {ArrowsPointingOutIcon} from '@heroicons/react/24/outline';

interface IAppIframeProps {
  src: string;
  loadingTitle:string
}

const AppIframe = ({src,loadingTitle}: IAppIframeProps) => {
  const waspFrameRef = useRef<HTMLIFrameElement>(null);
  const [appIsLoading, setAppIsLoading] = useState(true);
  const [height, setHeight] = useState('630px');
  const [iframeWithSrcModal, setIframeWithSrcModal] = useState(false);

  const fixFrameHeight = () => {
    console.log("onload is returning")
    setHeight(`${waspFrameRef?.current?.contentWindow?.document.body.scrollHeight ?? 630} + ${24} + px`);
    setAppIsLoading(false);
  };
  const onload = () => {
    setTimeout(() => fixFrameHeight, 5000);
    setAppIsLoading(false);
  };
  useEffect(() =>{
    setTimeout(() => fixFrameHeight, 10000);
  },[]);
  return (
    <div className='relative'>
      {appIsLoading && (
        <div className='flex flex-col gap-6 items-center '>
          <h1 className='text-content-white text-xl w-full text-center'>{loadingTitle}</h1>
          <AnimateDots />
        </div>
      )}

      {!iframeWithSrcModal && (
        <iframe
          ref={waspFrameRef}
          className={`w-full bg-red bg-content-white [&_body]:m-0 flex-1 custom-scrollbar-thumb`}
          // src={`http://localhost:3030/chat/setting?menu=sectors`}
          src={src}
          height={height}
          onLoad={onload}
        ></iframe>
      )}
      <IconButton
        className='absolute -bottom-10 left-0 rounded-full hover:bg-content-grey-50'
        onClick={() => setIframeWithSrcModal(true)}
      >
        <ArrowsPointingOutIcon className='w-5 h-5 text-content-grey-400' />
      </IconButton>

      <IframeWithSrcDialog
        open={iframeWithSrcModal}
        onClose={() => setIframeWithSrcModal(false)}
        src={src}
      />
    </div>
  );
};
export default AppIframe;
