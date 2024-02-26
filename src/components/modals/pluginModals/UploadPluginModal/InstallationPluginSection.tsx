import {CheckIcon} from '@heroicons/react/24/outline';
import React from 'react';
import Highlight from 'react-highlight';

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
              <span className='w-7 h-7 rounded-full bg-content-green/[0.11] flex items-center justify-center'>
                <CheckIcon width={16} height={16} className='text-content-green' />
              </span>
              <p className='text-content-black font-poppins-semibold text-xs leading-5'>
                The plugin is successfully installed
              </p>
            </div>
          ) : (
            <>
              <p className='text-content-grey-900 text-sm'>The plugin is installing, please wait</p>
              <span className='text-content-black text-xs font-poppins-medium tracking-[-1px] flex items-center'>
                {`${installPercentage < 100 ? installPercentage : 100} %`}
              </span>
            </>
          )}
        </div>
        <div className='h-1.5 bg-content-white dark:bg-neutral-600 w-full '>
          <div
            className={`h-1.5 transition-all duration-200 ${
              installPercentage > 99 ? 'bg-content-green' : 'bg-content-accent w-0'
            }`}
            style={{width: `${installPercentage < 100 ? installPercentage : 100}%`}}
          ></div>
        </div>
      </div>
      <div className='w-full flex-auto py-4 px-5 overflow-auto bg-content-black text-left rounded-20 max-h-[342px] custom-scrollbar-thumb'>
        <Highlight
          innerHTML={false}
          className='text-content-white [&_.hljs-keyword]:text-content-blue-light [&_.hljs-string]:text-content-green [&_.hljs-selector-class]:text-content-red-400
                           [&_.hljs-attribute]:text-yellow-300 [&_.hljs-comment]:text-content-grey-400 [&_.hljs-comment]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500 
                           [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500  '
        >
          {processed_function_body}
        </Highlight>
      </div>
    </div>
  );
};

export default InstallationPluginSection;
