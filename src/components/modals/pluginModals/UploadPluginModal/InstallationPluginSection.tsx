import React from 'react';

import {CheckIcon} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// import Highlight from 'react-highlight';

const DynamicHighlight = dynamic(async () => (await import('react-highlight')).default, {
  ssr: false,
  loading: () => <div className='flex items-center justify-center p-7 h-32 bg-grey-150 animate-pulse' />,
});
type Props = {
  installPercentage: number;
  processed_function_body: string;
};

const InstallationPluginSection = ({installPercentage, processed_function_body}: Props) => {
  return (
    <div className='flex flex-col flex-auto'>
      <div className='flex flex-col mb-6'>
        <div className='flex justify-between mb-3 items-center'>
          {installPercentage > 99 ? (
            <div className='flex gap-3 items-center ml-auto'>
              <span className='w-7 h-7 rounded-full bg-secondary/[0.11] flex items-center justify-center'>
                <CheckIcon width={16} height={16} className='text-secondary' />
              </span>
              <p className='text-grey-900 font-semibold text-xs leading-5'>The plugin is successfully installed</p>
            </div>
          ) : (
            <>
              <p className='text-grey-800 text-sm'>The plugin is installing, please wait</p>
              <span className='text-grey-900 text-xs font-medium tracking-[-1px] flex items-center'>
                {`${installPercentage < 100 ? installPercentage : 100} %`}
              </span>
            </>
          )}
        </div>
        <div className='h-1.5 bg-grey-0 dark:bg-neutral-600 w-full '>
          <div
            className={`h-1.5 transition-all duration-200 ${
              installPercentage > 99 ? 'bg-secondary' : 'bg-primary w-0'
            }`}
            style={{width: `${installPercentage < 100 ? installPercentage : 100}%`}}
          ></div>
        </div>
      </div>
      <div className='w-full flex-auto py-4 px-5 overflow-auto bg-grey-900 text-left rounded-xl max-h-[342px] custom-scrollbar-thumb'>
        <DynamicHighlight
          innerHTML={false}
          className='text-grey-0 [&_.hljs-keyword]:text-secondary-600 [&_.hljs-string]:text-secondary [&_.hljs-selector-class]:text-danger-300
                      [&_.hljs-attribute]:text-yellow-300 [&_.hljs-comment]:text-grey-400 [&_.hljs-comment]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500 
                      [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500  '
        >
          {processed_function_body}
        </DynamicHighlight>
      </div>
    </div>
  );
};

export default InstallationPluginSection;
