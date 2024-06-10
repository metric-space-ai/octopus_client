import React, {useEffect, useState} from 'react';
import {IFundingText} from './types';
import TextAreaSection from './TextAreaSection';
import {Button} from '@/components/buttons';

type Props = {result: IFundingText; handleImproveWritingText: (row: IFundingText) => Promise<void>; isLoading: boolean};

const FormulationRow = ({result, handleImproveWritingText, isLoading}: Props) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);
  useEffect(() => {
    setText(result.text);
  }, [result]);
  return (
    <div className='flex flex-col'>
      <h3
        className='font-semibold text-xs leading-5 text-content-grey-900 mb-1.5'
        onClick={() => console.log({result, text})}
      >
        {result.title}
      </h3>
      {/* <p className='text-xs text-content-grey-900 mb-3.5'>{result.description}</p> */}
      <TextAreaSection
        value={text}
        setValue={setText}
        textareaCustomClassName='max-h-40'
        disabled={loading && isLoading}
        maxLenght={800}
      />
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
                            <div className='flex items-center justify-center w-8 h-8 bg-content-grey-900 mr-1 rounded-full'>
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
                                <div className='flex items-center justify-center py-[11px] px-4 rounded-b-2xl rounded-tr-2xl bg-content-grey-900 w-16'>
                                  <AnimateDots />
                                </div>

                                <div className='mx-auto'>
                                  <Button
                                    className='bg-content-grey-0 h-9'
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
                            className={`text-sm w-full border py-[7px] pr-[96px] pl-5 rounded-3xl resize-none outline-none focus:border-content-grey-900 custom-scrollbar-thumb`}
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
          title={loading && isLoading ? '' : 'Text Verbessern'}
          loading={loading && isLoading}
          disabled={(loading && isLoading) || text.length > 800}
          variant='primary'
          fontWeight='normal'
          onClick={() => {
            if (text.length > 800) return;
            handleImproveWritingText({...result, text});
            setLoading(true);
          }}
          className='rounded-[40px] w-[220px] !h-8'
        />
      </div>
    </div>
  );
};

export default FormulationRow;
