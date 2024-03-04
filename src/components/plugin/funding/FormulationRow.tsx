import React, {useState} from 'react';
import {IFundingText} from './types';
import TextAreaSection from './TextAreaSection';
import {Button} from '@/components/buttons';

type Props = {result: IFundingText; handleImproveWritingText: (row: IFundingText) => Promise<void>};

const FormulationRow = ({result, handleImproveWritingText}: Props) => {
  const [text, setText] = useState(result.text);
  return (
    <div className='flex flex-col'>
      <h3
        className='font-semibold text-xs leading-5 text-content-black mb-1.5'
        onClick={() => console.log({result, text})}
      >
        {result.title}
      </h3>
      {/* <p className='text-xs text-content-black mb-3.5'>{result.description}</p> */}
      <TextAreaSection value={text} setValue={setText} textareaCustomClassName='max-h-40' />
      {/* {selectedResult === result.id || result.communicates.length > 0 ? (
              <Disclosure>
                {({open}) => (
                  <div className='flex flex-col py-3 px-4 gap-4 bg-content-grey-100 rounded-3xl'>
                    <div className='flex justify-between'>
                      <h4 className='font-semibold text-xs leading-5 text-content-accent'>{`Question (${result.communicates.length})`}</h4>
                      <Disclosure.Button className='flex items-center'>
                        <ChevronUpIcon
                          className={classNames(
                            {'rotate-180 transform': !open},
                            'h-5 w-5 text-purple-500 transition-all',
                          )}
                        />
                      </Disclosure.Button>
                    </div>
                    <Disclosure.Panel className='flex flex-col gap-4'>
                      {result.communicates.map((question) => (
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
                                <IconButton className='!p-0'>
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
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            ) : (
              <Button
                size='small'
                title='Ask question'
                variant='primary'
                fontWeight='normal'
                onClick={() => setSelectedResult(result.id)}
                className='rounded-[40px] w-[103px] !h-7 !px-1'
              />
            )} */}
      <div className='flex gap-6'>
        <Button
          size='small'
          title='Text Erstellen'
          variant='primary'
          fontWeight='normal'
          onClick={() => {}}
          className='rounded-[40px] w-[220px] !h-8 hidden'
        />
        <Button
          size='small'
          title='Text Verbessern'
          variant='primary'
          fontWeight='normal'
          onClick={() => handleImproveWritingText(result)}
          className='rounded-[40px] w-[220px] !h-8'
        />
      </div>
    </div>
  );
};

export default FormulationRow;
