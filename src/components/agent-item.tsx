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
    {index > 0 && <span className='bg-grey-800 w-[1px] h-6 absolute -top-3 left-[18px]'></span>}
    <div className='flex relative'>
      <img src={userImageSample.src} className='rounded-full w-9 h-9' />
      <IconButton
        variant='dark'
        className='w-4 h-4 flex items-center justify-center absolute bottom-0 right-0'
      >
        <CodeBracketSquareIcon width={10} height={10} className='text-grey-0 absolute' />
      </IconButton>
      {agent.active && !expanded && (
        <span className='w-2 h-2 bg-primary rounded-full absolute right-0.5 top-0.5' />
      )}
    </div>
    {expanded && (
      <>
        <div className='flex flex-col ml-3'>
          <h6 className='font-semibold text-xs leading-5 text-grey-900 truncate max-w-[160px] max-h-5'>
            {agent.title}
          </h6>
          <span
            className={`text-xs font-medium leading-5 ${
              agent.active ? 'text-primary' : 'text-grey-600'
            } `}
          >
            {agent.reply_count}
          </span>
        </div>
        <span className='ml-auto text-xxs leading-4 text-grey-600 font-normal'>
          {agent.active ? agent.when : 'Inactive'}
        </span>
      </>
    )}
  </>
);

export default AgentItem;
