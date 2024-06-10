import React, {Fragment, useState} from 'react';

import {Input} from '@/components/input';

import {
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  FolderIcon,
  LockClosedIcon,
  LockOpenIcon,
  StopIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

import {ClockLoadingIcon} from '@/components/svgs';
import {Listbox, Transition} from '@headlessui/react';
import classNames from 'classnames';
import {Button, IconButton} from '@/components/buttons';
import {CreativityLevel, AuthMethods, GENERATINGAPPSTEPS, DIRECTORIES, JOBS, FILEVIEW} from './waspGeneratorConstants';
import {TDirectories} from './waspGeneratorTypes';
import Highlight from 'react-highlight';

import './../../../assets/a11y-light.css';

type Props = {};

const WaspAppGenerator = (props: Props) => {
  const [selectedCreativityLevel, setSelectedCreativityLevel] = useState(CreativityLevel[0]);
  const [selectedAuthModel, setSelectedAuthModel] = useState(AuthMethods[0]);
  const [lockOpen, setLockOpen] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [directories, setDirectories] = useState<TDirectories[]>();
  const [steps, setSteps] = useState(GENERATINGAPPSTEPS.First);

  const handleGotoTheNextStep = () => {
    setSteps((prev) => prev + 1);
    setDirectories(DIRECTORIES);
  };

  //   .loader {
  //     width: 48px;
  //     height: 48px;
  //     border-radius: 50%;
  //     display: inline-block;
  //     border-top: 3px solid #FFF;
  //     border-right: 3px solid transparent;
  //     box-sizing: border-box;
  //     animation: rotation 1s linear infinite;
  //   }

  //   @keyframes rotation {
  //     0% {
  //       transform: rotate(0deg);
  //     }
  //     100% {
  //       transform: rotate(360deg);
  //     }
  //   }
  const HISTORIES = ['history 1', 'history 2', 'history 3', 'history 4'];
  let dirCount = 0;
  return (
    <>
      <div className='flex flex-col rounded-20 bg-content-grey-900 p-5 pr-4 gap-6 w-full max-h-[668px] max-w-[803px] custom-scrollbar-thumb'>
        <div className='flex flex-col gap-4'>
          <div className='bg-content-grey-0 rounded-20 p-4 flex flex-col gap-3'>
            {openHistory ? (
              <div className='flex flex-col relative -mr-2.5'>
                <h5 className='text-sm mb-3 font-semibold text-content-accent-hover '>History:</h5>
                <div className='flex flex-col gap-3 max-h-[210px] custom-scrollbar-thumb pr-2.5 w-full'>
                  {HISTORIES.map((history, index) => (
                    <div
                      key={`history-item-${index}`}
                      className='flex flex-wrap items-center justify-between px-4 py-[13px] rounded-[18px] bg-content-grey-100'
                    >
                      <p className='text-xs font-semibold text-content-grey-900 '>{history}</p>
                      <div className='flex flex-wrap gap-4'>
                        <Button
                          title='Load this version'
                          variant='outline'
                          className='rounded-20 w-[138px] !h-9 !bg-content-grey-0 border-content-grey-100'
                          fontWeight='normal'
                          size='small'
                        />
                        <Button
                          title='Run this version'
                          variant='outline'
                          className='rounded-20 w-[130px] !h-9 !bg-content-grey-0 border-content-grey-100'
                          fontWeight='normal'
                          size='small'
                        />
                        <Button title={'Save'} variant='primary' className='rounded-20 w-[84px] !h-9' size='small' />
                        <IconButton
                          className='m-auto p-0'
                          // onClick={() => handleDeleteServiceAiFunction(index, func)}
                        >
                          {/* {deleteFunctionsIsLoading ? (
                                      <Spinner />
                                    ) : (
                                        )} */}
                          <TrashIcon className='w-4 h-4 text-content-grey-900 hover:text-content-red-600' />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className='flex flex-col rounded-3xl py-3 px-1 min-h-[32px] max-h-[66px] bg-content-grey-100 relative justify-center'>
                  {steps === GENERATINGAPPSTEPS.Second && (
                    <div className='flex justify-between items-center custom-scrollbar-thumb pr-1 pl-3 max-h-12'>
                      <div className='flex flex-col gap-1'>
                        {JOBS.map((job, index) => (
                          <div className='flex gap-2 items-center' key={`jobs-${index}`}>
                            {JOBS.length === index + 1 ? (
                              <span className='inline-block w-4 h-4 border border-content-border-dark border-l-transparent animate-spin box-border rounded-full'></span>
                            ) : (
                              <CheckIcon className='w-4 h-4 text-content-border-dark' />
                            )}
                            <span className='block text-sm text-content-grey-900'>{job}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className='bg-content-grey-0 !text-[13px] !h-9 absolute right-5'
                        variant='transparent'
                        size='small'
                        iconBefore={<StopIcon className='w-4 h-4' />}
                        title='Stop generating...'
                        //   onClick={() => deleteMessage(item, false)}
                      />
                    </div>
                  )}
                </div>
                <div className='flex flex-col md:flex-row gap-3 min-h-[80px]'>
                  <div className='flex w-full md:w-auto min-w-[233px] flex-col rounded-3xl bg-content-grey-800 pl-4 py-3 pr-1.5'>
                    <div className='w-full h-full custom-scrollbar-thumb flex flex-col gap-2 max-h-[223px]'>
                      {steps === GENERATINGAPPSTEPS.Second &&
                        directories &&
                        directories.map((row) => {
                          if (row.type === 'directory') dirCount++;
                          return (
                            <div
                              key={row.name}
                              className={classNames(
                                'flex gap-1 text-content-grey-300 text-sm items-center',
                                row.type === 'directory' && `pl-${(dirCount - 1) * 4}`,
                                row.type === 'file' && `pl-${dirCount * 4}`,
                              )}
                              style={{
                                paddingLeft: `${(row.type === 'directory' ? dirCount - 1 : dirCount) * 16}px`,
                              }}
                            >
                              {row.type === 'directory' ? (
                                <FolderIcon className='w-3.5 h-3.5 text-content-grey-300' />
                              ) : (
                                <CodeBracketIcon className='w-3.5 h-3.5 text-content-grey-300' />
                              )}
                              {row.name}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div
                    className={classNames(
                      'flex-1 flex flex-col rounded-3xl bg-content-grey-100 py-3 pl-4 pr-1.5 md:max-w-[calc(100%_-_245px)]',
                    )}
                  >
                    <div
                      className={classNames(
                        'w-full h-full custom-scrollbar-thumb max-w-full',
                        steps === GENERATINGAPPSTEPS.Second && 'max-h-[223px]',
                      )}
                    >
                      {steps === GENERATINGAPPSTEPS.Second && (
                        <Highlight
                          innerHTML={false}
                          // className='text-content-grey-0 [&_.hljs-name]:text-content-blue-light [&_.hljs-tag]:text-content-green [&_.hljs-keyword]:text-content-red-400
                          // [&_.hljs-meta]:text-content-grey-400 [&_.hljs-meta]:italic [&_.hljs-class]:text-green-500  [&_.hljs-params]:text-green-500
                          // [&_.hljs-function]:text-yellow-200 [&_.hljs-built_in]:text-yellow-500  '
                        >
                          {FILEVIEW.content}
                        </Highlight>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='flex gap-4 justify-end '>
            {lockOpen ? (
              <LockOpenIcon
                className='cursor-pointer w-5 h-5 text-content-grey-400 hover:text-content-grey-0'
                onClick={() => setLockOpen((prev) => !prev)}
              />
            ) : (
              <LockClosedIcon
                className='cursor-pointer w-5 h-5 text-content-grey-400 hover:text-content-grey-0'
                onClick={() => setLockOpen((prev) => !prev)}
              />
            )}
            <span className='block h-6 border-r border-content-grey-600' />
            <ClockLoadingIcon
              className='cursor-pointer w-5 h-5 stroke-content-grey-0 hover:stroke-content-grey-0'
              onClick={() => setOpenHistory((prev) => !prev)}
            />
            <span className='block h-6 border-r border-content-grey-600' />
            <ChatBubbleBottomCenterTextIcon className='cursor-pointer w-5 h-5 text-content-grey-0' />
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          {lockOpen && (
            <>
              <div className='flex flex-row flex-wrap gap-4'>
                <div className='flex-1 min-w-[220px]'>
                  <Input
                    label='API access URL:'
                    labelClassName={'mb-3 text-content-grey-0 !text-sm font-semibold'}
                    inputCoverClassName={'px-4 h-9.5 !bg-content-grey-100 !py-0 '}
                    inputClassName='!text-sm font-normal !bg-transparent border-0'
                    type='text'
                    placeholder='https://api.example.com'
                  />
                </div>
                <div className='flex-1 min-w-[220px]'>
                  <Input
                    label='Secret access token:'
                    labelClassName={'mb-3 text-content-grey-0 !text-sm font-semibold'}
                    inputCoverClassName={'px-4 h-9.5 !bg-content-grey-100 !py-0 '}
                    inputClassName='!text-sm font-normal !bg-transparent border-0'
                    type='text'
                    placeholder='https://api.example.com'
                    className='text-content-grey-100'
                  />
                </div>
              </div>
              <div className='flex flex-row flex-wrap gap-4'>
                <div className='flex-1 flex flex-col gap-3 min-w-[220px]'>
                  <span className='block text-content-grey-0 text-sm font-semibold'>Creativity level:</span>
                  <Listbox value={selectedCreativityLevel} onChange={setSelectedCreativityLevel}>
                    <div className='relative '>
                      <Listbox.Button
                        className={({open}) =>
                          classNames(
                            'relative w-full cursor-default bg-content-grey-100 py-1.5 pl-5 pr-10 text-left text-content-primary h-9.5',
                            !open && 'rounded-[48px]',
                            open && 'bg-content-grey-0 rounded-t-20',
                          )
                        }
                      >
                        <div className='flex gap-1 items-center'>
                          <span className='text-sm text-content-grey-800'>{selectedAuthModel.label}</span>
                        </div>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                          <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='z-10 absolute max-h-60 w-full overflow-auto rounded-b-20 bg-content-grey-0 py-1 text-content-primary'>
                          {CreativityLevel.map((level, tabIdx) => (
                            <Listbox.Option
                              key={tabIdx}
                              className={({active}) =>
                                `relative select-none py-2 px-5 border-b border-content-grey-100 h-9.5 ${
                                  active ? 'bg-content-grey-100' : 'text-content-grey-900'
                                }`
                              }
                              value={level}
                            >
                              {({selected}) => (
                                <>
                                  <span className='block truncate text-sm'>{level}</span>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                <div className='flex-1 flex flex-col gap-3 min-w-[220px]'>
                  <span className='block text-content-grey-0 text-sm font-semibold'>Auth method:</span>
                  <Listbox value={selectedAuthModel} onChange={setSelectedAuthModel}>
                    <div className='relative '>
                      <Listbox.Button
                        className={({open}) =>
                          classNames(
                            'relative w-full cursor-default bg-content-grey-100 py-1.5 pl-5 pr-10 text-left text-content-primary h-9.5',
                            !open && 'rounded-[48px]',
                            open && 'bg-content-grey-0 rounded-t-20',
                          )
                        }
                      >
                        <div className='flex gap-1 items-center'>
                          <span className='text-sm text-content-grey-800'>{selectedAuthModel.label}</span>
                        </div>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                          <ChevronDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='z-10 absolute max-h-60 w-full overflow-auto rounded-b-20 bg-content-grey-0 py-1 text-content-primary'>
                          {AuthMethods.map((method, tabIdx) => (
                            <Listbox.Option
                              key={tabIdx}
                              className={({active}) =>
                                `relative select-none py-2 px-5 border-b border-content-grey-100 h-9.5 ${
                                  active ? 'bg-content-grey-100' : 'text-content-grey-900'
                                }`
                              }
                              value={method}
                            >
                              {({selected}) => <span className='block truncate text-sm'>{method.label}</span>}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>
            </>
          )}
          <div className='flex-1 min-w-[220px]'>
            <Input
              label='App name:'
              labelClassName={'mb-3 text-content-grey-0 !text-sm font-semibold'}
              inputCoverClassName={'px-4 h-9.5 !bg-content-grey-100 !py-0 '}
              inputClassName='!text-sm font-normal !bg-transparent border-0'
              type='text'
              placeholder='https://api.example.com'
            />
          </div>
          <div className='flex-1 min-w-[220px]'>
            <label className='flex flex-col gap-3 text-content-grey-0 text-sm font-semibold'>
              Description:
              <textarea
                className='px-4 py-2 custom-scrollbar-thumb resize-none h-21 text-sm font-normal bg-content-grey-100 rounded-[18px] text-content-grey-900'
                rows={3}
                //   label='Description:'
                //   labelClassName={'mb-3 text-content-grey-0 !text-sm font-semibold'}
                //   inputCoverClassName={'px-4 h-9.5 !bg-content-grey-100 !py-0 '}
                //   inputClassName='!text-sm font-normal !bg-transparent border-0'
                //   type='text'
                placeholder='https://api.example.com'
              />
            </label>
          </div>
        </div>
        <Button
          title={'Generate the app'}
          //   title={!isLoading ? 'Continue' : ''}
          //   disabled={isLoading || coreIdea.length < 5}
          //   loading={isLoading}
          onClick={handleGotoTheNextStep}
          className='rounded-[40px] w-[220px] !h-9 p-4'
        />

        {/* {currentStep === FUNDSTEPS.CoreIdea && (
            <Button
              title={!isLoading ? 'Continue' : ''}
              disabled={isLoading || coreIdea.length < 5}
              loading={isLoading}
              onClick={handleCreateNewFundingTopic}
              className='rounded-[40px] w-[220px] !h-9'
            />
          )} */}
      </div>
    </>
  );
};

export default WaspAppGenerator;
