import {Dispatch, SetStateAction, useEffect, useState} from 'react';

import {CodeBracketSquareIcon} from '@heroicons/react/24/outline';
import {PlusIcon} from '@heroicons/react/24/solid';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {useDispatch, useSelector} from 'react-redux';

import {selectScheduledPrompts} from '@/app/lib/features/scheduledPrompts/scheduledPromptsSelector';
import {
  changeOpenEditSchedulePromptDialog,
  changeSelectedSchedulePrompt,
  getAllScheduledPrompts,
} from '@/app/lib/features/scheduledPrompts/scheduledPromptsSlice';
import {AppDispatch} from '@/app/lib/store';
import {IconButton} from '@/components/buttons';
import {AddPromptAgentModal} from '@/components/modals/agents/AddPromptAgentModal';
import {EditPromptAgentModal} from '@/components/modals/agents/EditPromptAgentModal';
import {IScheduledPrompts} from '@/types';

import AgentItem from './agent-item';
import {Spinner} from '../spinner';

const ChatList = dynamic(async () => (await import('@/components/chat-list')).ChatList, {
  ssr: false,
  loading: () => null,
});

export type TAgent = {
  id: string;
  title: string;
  reply_count: string;
  when: string;
  active: boolean;
};

// const AGENTSDATA: TAgent[] = [
//   {
//     id: 'agent_1',
//     title: 'Quick check-in: How is…',
//     reply_count: '65 replies',
//     when: '19 mins',
//     active: true,
//   },
//   {
//     id: 'agent_2',
//     title: 'Quick check-in: How is…',
//     reply_count: '19 replies',
//     when: '19 mins',
//     active: true,
//   },
//   {
//     id: 'agent_3',
//     title: 'Quick check-in: How is…',
//     reply_count: '65 replies',
//     when: '19 mins',
//     active: true,
//   },
//   {
//     id: 'agent_4',
//     title: 'Quick check-in: How is…',
//     reply_count: '65 replies',
//     when: '19 mins',
//     active: false,
//   },
// ];

type Props = {
  className?: string;
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export function Agents({className, expanded, setExpanded}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    entities: allAgents,
    isLoading: agentsIsLoading,
    selectedScheduledPrompt,
    openEditSchedulePromptDialog,
  } = useSelector(selectScheduledPrompts);

  const [addAgentModal, setAddAgentModal] = useState(false);
  // const [selectedScheduledPrompt, setSelectedAgentPrompt] = useState<IScheduledPrompts>();
  const handleOpenExistSchedulePromptDialog = (agent: IScheduledPrompts) => {
    dispatch(changeSelectedSchedulePrompt(agent));
    dispatch(changeOpenEditSchedulePromptDialog(true));
  };
  const handleCloseExistSchedulePromptDialog = () => {
    dispatch(changeSelectedSchedulePrompt(null));
    dispatch(changeOpenEditSchedulePromptDialog(false));
  };

  useEffect(() => {
    dispatch(getAllScheduledPrompts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={classNames(
          'hidden sm:flex flex-col px-4 py-6 bg-grey-0 border-box rounded-r-xl shadow-agent-sidebar ',
          className,
        )}
        style={{width: expanded ? '282px' : '68px', minWidth: expanded ? '282px' : '68px'}}
      >
        <div className='flex items-center justify-start mb-8'>
          <IconButton variant='grey' onClick={() => setExpanded(!expanded)}>
            <CodeBracketSquareIcon className='text-grey-800 dark:text-grey-0' width={20} height={20} />
          </IconButton>
          {expanded && (
            <>
              <h2 className='text-lg font-semibold text-grey-900 ml-3 '>Agents</h2>
              <IconButton variant='primary' className='ml-auto' onClick={() => setAddAgentModal(true)}>
                <PlusIcon className='w-5 h-5 text-grey-0' />
              </IconButton>
            </>
          )}
        </div>
        {agentsIsLoading && !allAgents && (
          <div className='flex flex-col py-10 items-center justify-center'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col'>
          {allAgents?.map((agent, index) => (
            <div
              className={`flex items-center relative cursor-pointer ${index === 0 ? 'pb-3' : 'py-3'}`}
              onClick={() => handleOpenExistSchedulePromptDialog(agent)}
              key={agent.id}
            >
              <AgentItem expanded={expanded} agent={agent} index={index} />
            </div>
          ))}
        </div>
        {!expanded && (
          <div className='mt-auto flex items-center'>
            <IconButton variant='primary' onClick={() => setAddAgentModal(true)}>
              <PlusIcon className='w-5 h-5 text-grey-0' />
            </IconButton>
          </div>
        )}
      </div>
      <AddPromptAgentModal onClose={() => setAddAgentModal(false)} open={addAgentModal} />

      <EditPromptAgentModal
        onClose={handleCloseExistSchedulePromptDialog}
        open={openEditSchedulePromptDialog}
        promptData={selectedScheduledPrompt}
      />
    </>
  );
}
export {ChatList};
