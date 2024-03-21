import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Disclosure} from '@headlessui/react';
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  StopIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {useDebouncedCallback} from 'use-debounce';

import {IResearchResult} from './types';

import userImageSample from '../../../../public/images/user-sample.png';
import {AnimateDots, LogoIcon} from '../../svgs';
import {Button, IconButton} from '@/components/buttons';

import {autoGrowTextArea, clearWhitespaces} from '@/helpers';

type Props = {
  researchItem: IResearchResult;
  handleShowContainedInformation: (text: string, researchItem: IResearchResult) => void;
  submitChat: (userInput: string, researchItem: IResearchResult) => void;
  isLoading: boolean;
  //   onInput: (text: string) => void;
  //   onInputKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  //   doSubmit: (userInput: string) => void;
};

const ResearchItemRow = ({researchItem, handleShowContainedInformation, submitChat, isLoading}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [inputRows, setInputRows] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [openDisclosure, setOpenDisclosure] = useState(true);
  const [questionIsLoading, setQuestionIsLoading] = useState(false);
  const [questionAsked, setQuestionAsked] = useState('');

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const doSubmit = () => {
    if (userInput.trim() === '') return;
    setQuestionIsLoading(true);
    setQuestionAsked(userInput);
    setUserInput('');
    submitChat(userInput, researchItem);
    // newMessage(userInput, !enabledContentSafety);
    // setUserInput('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      doSubmit();
      e.preventDefault();
    }
  };

  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(1, rows));

      setInputRows(inputRows > 10 ? 10 : inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [userInput]);

  useEffect(() => {
    if (!isLoading) {
      setQuestionIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (researchItem) {
      setQuestionAsked('');
    }
  }, [researchItem]);

  return (
    <Disclosure>
      {({open}) => (
        <Fragment>
          <div
            className={classNames('flex items-center', {
              'py-4': !open,
              'pb-2 pt-4': open,
            })}
          >
            <h5 className='w-36 leading-5 text-xs font-semibold truncate ...'>{researchItem.sourceName}</h5>
            <a
              href={researchItem.sourceLink}
              target='_blank'
              className='w-36 ml-1 text-xxs leading-4 text-content-grey-900 truncate ...'
            >
              {researchItem.sourceLink}
            </a>
            <span className='w-24 ml-1 text-xxs leading-4 text-content-grey-900 truncate ... text-center'>
              {researchItem.occurrences}
            </span>
            <div className='w-[200px] ml-[5px] flex gap-3'>
              {researchItem.containedInformation && (
                <IconButton
                  className='!p-0 cursor-pointer'
                  onClick={() => handleShowContainedInformation(researchItem.containedInformation, researchItem)}
                >
                  <ArrowTopRightOnSquareIcon className='h-4 w-4 text-purple-500 transition-all ' />
                </IconButton>
              )}
              <span className=' text-xxs leading-4 text-content-grey-900 truncate ...'>
                {`${researchItem.containedInformation.slice(0, 20)}...`}
              </span>
            </div>
            {}
            <div className='h-7'>
              <Disclosure.Button
                className={classNames(
                  'h-7 px-3 text-xs font-semibold text-content-white text-center rounded-[40px] bg-content-accent',
                  {
                    hidden: !!open,
                  },
                )}
              >
                Ask question
              </Disclosure.Button>
            </div>
          </div>
          <Disclosure.Panel className='flex flex-col rounded-3xl bg-content-grey-100 mb-6 gap-4 px-4 py-3'>
            <div className='flex justify-between'>
              {researchItem.messages && researchItem.messages.length > 0 ? (
                <h6
                  onClick={() => console.log({researchItem})}
                  className='leading-5 text-xs font-semibold text-content-accent'
                >{`Question (${
                  researchItem.messages && researchItem.messages.filter((message) => message.role === 'user').length
                })`}</h6>
              ) : (
                <h6 className='leading-5 text-xs font-semibold text-content-accent'>Ask question</h6>
              )}
              {researchItem.messages && researchItem.messages.length > 0 ? (
                <IconButton className='!p-0 cursor-pointer' onClick={() => setOpenDisclosure((prev) => !prev)}>
                  <ChevronUpIcon
                    className={classNames(
                      {'rotate-180 transform': !openDisclosure},
                      'h-4 w-4 text-purple-500 transition-all',
                    )}
                  />
                </IconButton>
              ) : (
                <Disclosure.Button className={'w-5 h-5'}>
                  <XMarkIcon className='w-5 h-5 text-content-black' />
                </Disclosure.Button>
              )}
            </div>
            {openDisclosure && (
              <>
                {researchItem.messages &&
                  researchItem.messages.map((question) => (
                    <div className='flex flex-col gap-4' key={clearWhitespaces(question.content)}>
                      {question.role === 'user' && (
                        <div className='flex items-start gap-2'>
                          <div className='mr-1'>
                            <img src={userImageSample.src} className='rounded-full w-8 h-8' />
                          </div>
                          <p className='text-sm flex-1 self-center'>{question.content}</p>
                          <IconButton className='!p-0'>
                            <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                          </IconButton>
                        </div>
                      )}
                      {question.role === 'system' && (
                        <div className='flex gap-2 items-start'>
                          <div className='flex items-center justify-center w-8 h-8 bg-content-black mr-1 rounded-full'>
                            <LogoIcon width={19} height={12} color='#F5F5F5' />
                          </div>
                          <p className='text-sm flex-1 self-center'>{question.content}</p>
                          <IconButton className='!p-0 cursor-pointer'>
                            <ArrowPathIcon className='w-4 h-4 text-content-grey-600' />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  ))}
                {questionAsked && (
                  <div className='flex items-start gap-2'>
                    <div className='mr-1'>
                      <img src={userImageSample.src} className='rounded-full w-8 h-8' />
                    </div>
                    <p className='text-sm flex-1 self-center'>{questionAsked}</p>
                    <IconButton className='!p-0'>
                      <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                    </IconButton>
                  </div>
                )}
                {questionIsLoading && (
                  <div className='flex flex-col gap-4 flex-1'>
                    <div className='flex gap-2 items-start'>
                      <div className='flex items-center justify-center w-8 h-8 bg-content-black mr-1 rounded-full'>
                        <LogoIcon width={19} height={12} color='#F5F5F5' />
                      </div>
                      <div className='flex items-center justify-center py-[11px] px-4 rounded-b-2xl rounded-tr-2xl bg-content-black w-16'>
                        <AnimateDots />
                      </div>
                    </div>

                    <div className='mx-auto hidden'>
                      <Button
                        className='bg-white h-9'
                        variant='transparent'
                        size='small'
                        iconBefore={<StopIcon className='w-4 h-4' />}
                        title='Stop generating...'
                        // onClick={() => deleteMessage(item, false)}
                      />
                    </div>
                  </div>
                )}
                <div className='flex gap-3 items-start'>
                  <div>
                    <img src={userImageSample.src} className='rounded-full w-8 h-8' />
                  </div>
                  <div className='relative flex-1 flex items-center'>
                    <textarea
                      ref={inputRef}
                      className={`text-sm w-full border py-[7px] pr-[96px] pl-5 rounded-3xl resize-none outline-none focus:border-content-black custom-scrollbar-thumb`}
                      placeholder='Ask anything'
                      onInput={(e) => onInput(e.currentTarget.value)}
                      value={userInput}
                      onKeyDown={onInputKeyDown}
                      rows={inputRows}
                      autoFocus={true}
                    />
                    <span
                      className={classNames('text-content-grey-400 text-xs right-12 absolute', {
                        'text-content-red-600': userInput.length > 300,
                      })}
                    >{`${userInput.length}/300`}</span>
                    <IconButton className='absolute right-0 !w-9 !h-9' onClick={doSubmit}>
                      <PaperAirplaneIcon className='w-5 h-5 text-content-grey-600' />
                    </IconButton>
                  </div>
                </div>
              </>
            )}
          </Disclosure.Panel>
        </Fragment>
      )}
    </Disclosure>
  );
};
export default ResearchItemRow;
