import React from 'react';

import userImageSample from './../../public/images/user-sample.png';
import {IconButton} from './buttons';
import {CodeBracketSquareIcon} from '@heroicons/react/24/outline';
import {TAgent} from './agents';

type Props = {
  expanded: boolean;
  agent: TAgent;
  index: number;
};

const AgentItem = ({expanded, agent, index}: Props) => (
  <>
    {index > 0 && <span className='bg-content-grey-900 w-[1px] h-6 absolute -top-3 left-[18px]'></span>}
    <div className='flex relative'>
      <img src={userImageSample.src} className='rounded-full w-9 h-9' />
      <IconButton
        variant='dark'
        onClick={() => console.log('agent item image...')}
        className='w-4 h-4 flex items-center justify-center absolute bottom-0 right-0'
      >
        <CodeBracketSquareIcon width={10} height={10} className='text-content-white absolute' />
      </IconButton>
      {agent.active && !expanded && (
        <span className='w-2 h-2 bg-content-accent rounded-full absolute right-0.5 top-0.5' />
      )}
    </div>
    {expanded && (
      <>
        <div className='flex flex-col ml-3'>
          <h6 className='font-poppins-semibold text-xs leading-5 text-content-black truncate max-w-[160px] max-h-5'>
            {agent.title}
          </h6>
          <span
            className={`text-xs font-poppins-medium leading-5 ${
              agent.active ? 'text-content-accent' : 'text-content-grey-600'
            } `}
          >
            {agent.reply_count}
          </span>
        </div>
        <span className='ml-auto text-xxs leading-4 text-content-grey-600 font-normal'>
          {agent.active ? agent.when : 'Inactive'}
        </span>
      </>
    )}
  </>
);

export default AgentItem;
