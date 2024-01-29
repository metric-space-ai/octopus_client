import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Disclosure} from '@headlessui/react';
import {
  ArrowPathIcon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  StopIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {IResearchResult} from './types';
import classNames from 'classnames';

import userImageSample from '../../../../public/images/user-sample.png';
import {AnimateDots, LogoIcon} from '../../svgs';
import {Button, IconButton} from '@/components/buttons';
import {useDebouncedCallback} from 'use-debounce';
import {autoGrowTextArea} from '@/helpers';

type Props = {
  researchItem: IResearchResult;
  //   onInput: (text: string) => void;
  //   onInputKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  //   doSubmit: (userInput: string) => void;
};

const ResearchItemRow = ({researchItem}: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [inputRows, setInputRows] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [openDisclosure, setOpenDisclosure] = useState(true);

  const onInput = (text: string) => {
    setUserInput(text);
  };

  const doSubmit = (userInput: string) => {
    if (userInput.trim() === '') return;
    // newMessage(userInput, !enabledContentSafety);
    // setUserInput('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      doSubmit(userInput);
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
  return (
    <Disclosure key={researchItem.id}>
      {({open}) => (
        <Fragment>
          <div
            className={classNames('flex items-center', {
              'py-4': !open,
              'pb-2 pt-4': open,
            })}
          >
            <h5 className='w-36 leading-5 text-xs font-semibold truncate ...'>{researchItem.name}</h5>
            <span className='w-36 ml-1 text-xxs leading-4 text-content-grey-900 truncate ...'>{researchItem.url}</span>
            <span className='w-24 ml-1 text-xxs leading-4 text-content-grey-900 truncate ...'>
              {researchItem.grade}
            </span>
            <span className='w-[200px] ml-[5px] text-xxs leading-4 text-content-grey-900 truncate ...'>
              {researchItem.information}
            </span>
            {}
            <div className='h-7'>
              {/* <Button
                    title='Ask question'
                    variant='primary'
                    //   onClick={() => setResearchSteps((currentStep) => currentStep + 1)}
                    className='rounded-[40px] w-[103px] !h-7 !px-3'
                    size='small'
                /> */}
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
              {researchItem.messages.length > 0 ? (
                <h6 className='leading-5 text-xs font-semibold text-content-accent'>{`Question (${researchItem.messages.length})`}</h6>
              ) : (
                <h6 className='leading-5 text-xs font-semibold text-content-accent'>Ask question</h6>
              )}
              {researchItem.messages.length > 0 ? (
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
                {researchItem.messages.map((question) => (
                  <div className='flex flex-col gap-4' key={question.id}>
                    <div className='flex items-start gap-2'>
                      <div className='mr-1'>
                        <img src={userImageSample.src} className='rounded-full w-8 h-8' />
                      </div>
                      <p className='text-sm flex-1'>{question.message}</p>
                      <IconButton className='!p-0'>
                        <PencilSquareIcon className='w-4 h-4 text-content-grey-600' />
                      </IconButton>
                    </div>
                    <div className='flex gap-2 items-start'>
                      <div className='flex items-center justify-center w-8 h-8 bg-content-black mr-1 rounded-full'>
                        <LogoIcon width={19} height={12} color='#F5F5F5' />
                      </div>
                      {question.status === 'answered' && (
                        <>
                          <p className='text-sm flex-1'>{question.response}</p>
                          <IconButton className='!p-0 cursor-pointer'>
                            <ArrowPathIcon className='w-4 h-4 text-content-grey-600' />
                          </IconButton>
                        </>
                      )}
                      {question.status === 'asking' && (
                        <div className='flex flex-col gap-4 flex-1'>
                          <div className='flex items-center justify-center py-[11px] px-4 rounded-b-2xl rounded-tr-2xl bg-content-black w-16'>
                            <AnimateDots />
                          </div>

                          <div className='mx-auto'>
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
                    </div>
                  </div>
                ))}
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
                    <IconButton className='absolute right-0 !w-9 !h-9' onClick={() => doSubmit(userInput)}>
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
