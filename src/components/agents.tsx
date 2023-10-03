import {useEffect, useState, Dispatch, SetStateAction} from 'react';

import {Switch} from '@headlessui/react';
import {CodeBracketSquareIcon, MagnifyingGlassIcon, ShieldCheckIcon} from '@heroicons/react/24/outline';
import {PlusIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import {useChatStore} from '@/store';

import {IconButton} from './buttons';
import AgentItem from './agent-item';
import {AddPromptAgentModal} from './modals/AddPromptAgentModal';
import {EditPromptAgentModal} from './modals/EditPromptAgentModal';

const ChatList = dynamic(async () => (await import('./chat-list')).ChatList, {
  loading: () => null,
});

export type TAgent = {
  id: string;
  title: string;
  reply_count: string;
  when: string;
  active: boolean;
};

const AGENTSDATA: TAgent[] = [
  {
    id: 'agent_1',
    title: 'Quick check-in: How is…',
    reply_count: '65 replies',
    when: '19 mins',
    active: true,
  },
  {
    id: 'agent_2',
    title: 'Quick check-in: How is…',
    reply_count: '19 replies',
    when: '19 mins',
    active: true,
  },
  {
    id: 'agent_3',
    title: 'Quick check-in: How is…',
    reply_count: '65 replies',
    when: '19 mins',
    active: true,
  },
  {
    id: 'agent_4',
    title: 'Quick check-in: How is…',
    reply_count: '65 replies',
    when: '19 mins',
    active: false,
  },
];

type Props = {
  className?: string;
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export function Agents({className, expanded, setExpanded}: Props) {
  const chatStore = useChatStore();
  // const [enabled, setEnabled] = useState(true);
  const [showDeactivateConfirmationModal, setShowDeactivateConfirmationModal] = useState(false);
  const [timeDifference, setTimeDifference] = useState('(30:00)');
  const [addAgentModal, setAddAgentModal] = useState(false);
  const [existAgentModal, setExistAgentModal] = useState(false);
  const [selectedAgentPrompt, setSelectedAgentPrompt] = useState<TAgent>();

  useEffect(() => {
    // Function to calculate and update the time difference
    const calculateTimeDifference = () => {
      // Get the static date from local storage
      const storedDate = localStorage.getItem('contentSafetyTimestamp');

      if (storedDate) {
        const staticDate = new Date(storedDate).getTime();
        const currentDate = new Date().getTime();

        // Calculate the time difference in milliseconds
        const differenceInMilliseconds = 0.5 * 60 * 1000 - (currentDate - staticDate);

        // Calculate minutes and seconds
        const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));
        const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

        const newLocal = '(' + minutes + ':' + seconds + ')';
        // Set the time difference in state
        if (minutes <= 0 && seconds <= 0) {
          chatStore.changeContentSafteyStatus(true);
        } else {
          setTimeDifference(newLocal);
        }
      }
    };

    // Calculate and update the time difference initially
    calculateTimeDifference();

    // Set up an interval to update the time difference every second
    const intervalId = setInterval(calculateTimeDifference, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        className={classNames(
          'hidden sm:flex flex-col px-4 py-6 bg-white border-box rounded-r-[20px] shadow-agent-sidebar ',
          className,
        )}
        style={{width: expanded ? '282px' : '68px', minWidth: expanded ? '282px' : '68px'}}
      >
        <div className='flex items-center justify-start mb-8'>
          <IconButton variant='grey' onClick={() => setExpanded(!expanded)}>
            <CodeBracketSquareIcon width={20} height={20} />
          </IconButton>
          {expanded && (
            <>
              <h2 className='text-lg font-poppins-semibold text-content-black ml-3 '>Agents</h2>
              <IconButton variant='primary' className='ml-auto' onClick={() => setAddAgentModal(true)}>
                <PlusIcon className='w-5 h-5 text-white' />
              </IconButton>
            </>
          )}
        </div>
        <div className='flex flex-col'>
          {AGENTSDATA.map((agent, index) => (
            <div
              className={`flex items-center relative cursor-pointer ${index === 0 ? 'pb-3' : 'py-3'}`}
              onClick={() => {
                setExistAgentModal(true);
                setSelectedAgentPrompt(agent);
              }}
              key={agent.id}
            >
              <AgentItem expanded={expanded} agent={agent} index={index} />
            </div>
          ))}
        </div>
        {!expanded && (
          <div className='mt-auto flex items-center'>
            <IconButton variant='primary' onClick={() => setAddAgentModal(true)}>
              <PlusIcon className='w-5 h-5 text-white' />
            </IconButton>
          </div>
        )}
      </div>
      <AddPromptAgentModal onClose={() => setAddAgentModal(false)} open={addAgentModal} />
      {selectedAgentPrompt && (
        <EditPromptAgentModal
          onClose={() => setExistAgentModal(false)}
          open={existAgentModal}
          promptData={selectedAgentPrompt}
        />
      )}
    </>
  );
}
export {ChatList};
