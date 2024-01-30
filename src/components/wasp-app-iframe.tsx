import React, {useEffect, useRef, useState} from 'react';
import {AnimateDots} from './svgs';
import {IChatMessage} from '@/types';
import {IconButton} from './buttons';
import {APPREQUESTBASEURL} from '@/constant';
import {IframeWithSrcDialog} from './modals/IframeWithSrcDialog';
import {ArrowsPointingOutIcon} from '@heroicons/react/24/outline';

interface IAppIframeProps {
  item: IChatMessage;
}

const WaspAppIframe = ({item}: IAppIframeProps) => {
  const waspFrameRef = useRef<HTMLIFrameElement>(null);
  const [appIsLoading, setAppIsLoading] = useState(true);
  const [height, setHeight] = useState('420px');
  const [iframeWithSrcModal, setIframeWithSrcModal] = useState(false);

  const fixFrameHeight = () => {
    setHeight(`${waspFrameRef?.current?.contentWindow?.document.body.scrollHeight ?? 420} + ${24} + px`);
    setAppIsLoading(false);
  };
  const onload = () => {
    setTimeout(() => fixFrameHeight, 5000);
    setAppIsLoading(false);
  };
  return (
    <div className='relative'>
      {appIsLoading && (
        <div className='flex flex-col gap-6 items-center '>
          <h1 className='text-content-white text-xl w-full text-center'>Please Be Pationt - wasp app is Loading</h1>
          <AnimateDots />
        </div>
      )}

      {!iframeWithSrcModal && (
        <iframe
          ref={waspFrameRef}
          className={`w-full bg-red bg-content-white [&_body]:m-0 flex-1 custom-scrollbar-thumb`}
          // src={`http://localhost:3030/chat/setting?menu=sectors`}
          src={`${APPREQUESTBASEURL}api/v1/wasp-apps/${item.wasp_app_id}/${item.id}/proxy-frontend`}
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
        src={`${APPREQUESTBASEURL}api/v1/wasp-apps/${item.wasp_app_id}/${item.id}/proxy-frontend`}
      />
    </div>
  );
};
export default WaspAppIframe;
