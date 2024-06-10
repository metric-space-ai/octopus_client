import {
  ArrowLongRightIcon,
  ArrowTrendingUpIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

import {Logo} from './logo';
import React, {useState} from 'react';

// const EXAMPLES = [
//   {id: 'sample-message-1', title: 'Plan an itinerary', content: 'for a fashion-focused exploration of Paris'},
//   {id: 'sample-message-2', title: 'Help me pick', content: 'an outfit will look good on camera'},
//   {id: 'sample-message-3', title: 'Come up with concepts', content: 'for a retro-style arcade game'},
//   {id: 'sample-message-4', title: 'Give me ideas', content: `for what to do with my kids'art`},
// ];
const EXAMPLES = [
  {id: 'sample-message-1', content: 'Suggest measures to prevent a complex technical problem.'},
  {id: 'sample-message-2', content: 'Explain quantum computing in simple terms.'},
  {id: 'sample-message-3', content: 'Describe the last incident that occurred at work.'},
];

interface IChatPrompt {
  handleInputChange: (text: string) => void;
}
export const ChatPrompt = ({handleInputChange}: IChatPrompt) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => [setExpanded((prev) => !prev)];

  const PROMPT_CARDS = [
    {
      id: 'prompt-card-1',
      content: (
        <div
          className={`flex-1 flex flex-col p-5 gap-3 bg-grey-0 rounded-xl overflow-hidden h-[220px] min-w-[240px] lg:min-w-[320px] transition-all duration-300 ${
            expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
          }`}
          style={{transitionDelay: `100ms`}}
        >
          <p className='text-xs font-medium text-grey-900'>PROMPT OPTIONS</p>
          {EXAMPLES.map((elem, index) => (
            <div
              key={elem.id}
              onClick={() => handleInputChange(elem.content)}
              className={`flex justify-between px-4 py-2.5 bg-grey-100 rounded-xl transition-all duration-300 cursor-pointer ${
                expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
              }`}
              style={{transitionDelay: `${index + 4}00ms`}}
            >
              <p className='text-xs font-medium text-grey-900'>{elem.content}</p>
              <ArrowLongRightIcon className='w-4 h-4' />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'prompt-card-2',
      content: (
        <div
          className={`relative w-[272px] flex flex-col justify-end p-5 bg-grey-0 rounded-xl h-[220px] transition-all duration-300 ${
            expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
          }`}
          style={{transitionDelay: `200ms`}}
        >
          <div className='absolute right-3 top-3 w-9 h-9 flex items-center justify-center bg-primary-medium/10 rounded-full'>
            <ArrowTrendingUpIcon className='w-4 h-4 text-primary-medium' />
          </div>
          <div className='text-2xl font-semibold text-grey-900'>
            Unlock <span className='text-primary-medium'>Efficiency</span> and Be More Productive
          </div>
        </div>
      ),
    },
    {
      id: 'prompt-card-3',
      content: (
        <div
          className={`relative w-[272px] flex flex-col p-5 h-[220px] bg-prompt-background1 rounded-xl transition-all duration-300 ${
            expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
          }`}
          style={{transitionDelay: `300ms`}}
        >
          <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-grey-0 dark:bg-grey-800 rounded-full'>
            <ArrowLongRightIcon className='w-4 h-4 text-grey-0' />
          </div>
          <p className='text-xs font-medium text-grey-0'>WORKING CHECKLIST</p>
          <p className='text-xl font-semibold text-grey-0 mt-2'>5 Steps to Take First.</p>
        </div>
      ),
    },
    {
      id: 'prompt-card-4',
      content: (
        <div
          className={`relative w-[272px] flex flex-col p-5 h-[220px] bg-prompt-background2 rounded-xl transition-all duration-300 ${
            expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
          }`}
          style={{transitionDelay: `400ms`}}
        >
          <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-grey-0 dark:bg-grey-800 rounded-full'>
            <ArrowLongRightIcon className='w-4 h-4 text-grey-0' />
          </div>
          <p className='text-xs font-medium text-grey-0'>GET STARTED</p>
          <p className='text-xl font-semibold text-grey-0 mt-2'>7 Tips How Work More Effective</p>
        </div>
      ),
    },
    {
      id: 'prompt-card-5',
      content: (
        <div
          className={`relative flex-1 flex flex-col p-5 h-[220px] bg-auth-background bg-center bg-cover rounded-xl transition-all duration-300 ${
            expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
          }`}
          style={{transitionDelay: `500ms`}}
        >
          <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-grey-0 dark:bg-grey-800 rounded-full'>
            <ArrowLongRightIcon className='w-4 h-4 text-grey-0' />
          </div>
          <p className='text-xs font-medium text-grey-0'>INSTRUCTION</p>
          <p className='text-xl font-semibold text-grey-0 mt-2'>
            Utilizing the Octopus for Factory Work Assistance
          </p>
        </div>
      ),
    },
    {
      id: 'prompt-card-6',
      content: (
        <div
          className={`relative w-[272px] flex flex-col p-5 h-[220px] bg-primary rounded-xl transition-all duration-300 ${
            expanded ? `opacity-1 !translate-y-0` : `opacity-0 -translate-y-28 `
          }`}
          style={{transitionDelay: `600ms`}}
        >
          <div className='absolute right-4 bottom-4 w-9 h-9 flex items-center justify-center bg-grey-0 rounded-full'>
            <PlusIcon className='w-4 h-4 text-grey-900' />
          </div>
          <p className='text-xs font-medium text-grey-0'>PERSONAL TICKET</p>
          <p className='text-xl font-semibold text-grey-0 mt-2'>Create own ticket</p>
          <p className='text-xs font-medium text-grey-0 mt-1.5'>
            This chat will have a special color label to distinguish it from other tickets, allowing you to easily
            identify your own ticket.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className='h-full flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-4 w-full max-w-[1136px] h-full'>
        <div className='flex gap-4 items-center justify-center flex-1'>
          <Logo className='stroke-grey-400 [&_path]:fill-grey-400' />
          <h1 className='text-5.5xl font-bold text-grey-400'>Get started:</h1>
        </div>

        <div className='flex gap-4 flex-wrap'>
          {PROMPT_CARDS.map((card, index) => (
            <React.Fragment key={card.id}>{card.content}</React.Fragment>
          ))}
        </div>
        <div className='relative px-2 w-full'>
          <div
            onClick={toggleExpand}
            className='flex border border-grey-400/30 rounded-xl p-3 gap-3 bg-grey-100 hover:bg-primary-150 transition-all cursor-pointer items-center justify-center'
          >
            {expanded ? <BarsArrowUpIcon width={24} height={24} /> : <BarsArrowDownIcon width={24} height={24} />}
            <h2 className='text-grey-800 font-semibold'>prompt store</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
