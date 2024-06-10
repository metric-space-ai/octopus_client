import {useEffect, useState} from 'react';
import classNames from 'classnames';

import {ArrowPathIcon, PencilSquareIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Button, IconButton} from '../../buttons';
import {apiWaspHub} from '@/hooks';
import toast from 'react-hot-toast';
import {AxiosError} from 'axios';
import {
  IConsultantChat,
  IConsultantChatResponse,
  IConsultantChatResponseCallbackData,
  IConsultantRequestPayload,
  IConsultantResponse,
  IConsultantResponseCallbackData,
  IFinalConsultationRequest,
} from './type';
import {QUESTION_STEPS} from './consultantConstant';
import AdditionalInformations from './AdditionalInformations';
import apiHub from '@/hooks/useApiClient';

interface IConsult {}
export const Consultant = ({}: IConsult) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(QUESTION_STEPS.ASK);
  const [canNotHelp, setCanNotHelp] = useState(false);

  const [disclosure, setDisclosure] = useState('');
  const [question, setQuestion] = useState('');

  const [response, setResponse] = useState<IConsultantChatResponse>();
  const [shouldUpdate, setShouldUpdate] = useState({
    question: false,
    disclosure: false,
  });

  const [facts, setFacts] = useState('');
  const [chatArchive, setChatArchive] = useState<IConsultantChat[]>();

  const handleAskDifferentQuestion = () => {
    setStep(QUESTION_STEPS.ASK);
    setCanNotHelp(false);
    setQuestion('');
    setDisclosure('');
  };

  const handleShowEditMode = (fieldName: keyof typeof shouldUpdate) => {
    setShouldUpdate((prev) => ({...prev, [fieldName]: true}));
  };
  const handleAskFirstQuestion = () => {
    // setStep(QUESTION_STEPS.ANSWER);
    if (isLoading) return;

    createNewConsultant(disclosure, question);
    // setIsUpdated(true);
  };
  const checkUpdateButtonDisabled = (obj: object) =>
    (Object.keys(obj) as Array<keyof typeof obj>).every((key) => !obj[key]);

  const handleUpdateInformation = () => {
    setShouldUpdate({disclosure: false, question: false});
  };

  // const allQuestionIsAnswered = () => {

  //   setStep(QUESTION_STEPS.FACTS);
  // };
  const handleCreateConsultation = async () => {
    try {
      if (response && response.callback_data) {
        const {callback_data} = response;
        const parameters = {
          callback_data,
        };

        if (!response || !response.next_endpoint) return;

        const {status, data} = await apiHub.post<{Text: {response: string}}>('api/v1/ai-functions/direct-call', {
          name: response.next_endpoint.startsWith('/') ? response.next_endpoint.slice(1) : response.next_endpoint,
          parameters,
        });

        if (status === 201) {
          const parsedData: IFinalConsultationRequest = JSON.parse(data.Text.response);

          setChatArchive(callback_data.chat);
          setResponse(parsedData);
          setStep(QUESTION_STEPS.CONSULTATION);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  };
  useEffect(() => {
    if (step === QUESTION_STEPS.FACTS) {
      const countdown = () => {
        setStep(QUESTION_STEPS.CREATE_CONSULTATION);
      };
      setTimeout(countdown, 1);
    }
    if (step === QUESTION_STEPS.CREATE_CONSULTATION) {
      handleCreateConsultation();
      //   const countdown = () => {
      //     setStep(QUESTION_STEPS.CONSULTATION);

      //   };
      //   setTimeout(countdown, 5000);
    }
  }, [step]);


  const putNewAnswer = async (chat: IConsultantChat[]) => {
    setIsLoading(true);
    try {
      if (response && response.callback_data && typeof response.callback_data !== 'string') {
        const {callback_data} = response;
        const parameters: IConsultantRequestPayload = {
          UserAnswer: chat[chat.length - 1].answer,
          callback_data: {
            Kernfrage: callback_data.Kernfrage,
            Selbstauskunft: callback_data.Selbstauskunft,
            chat,
          },
        };

        if (!response || typeof response.next_endpoint !== 'string') return;

        const {status, data} = await apiHub.post<{Text: {response: string}}>('api/v1/ai-functions/direct-call', {
          // Remove the first parameter if it is '/'
          name: response.next_endpoint.startsWith('/') ? response.next_endpoint.slice(1) : response.next_endpoint,
          parameters,
        });

        if (status === 201) {
          const parsedData: IConsultantChatResponse = JSON.parse(data.Text.response);

          setResponse(parsedData);
          if (!parsedData.next_endpoint?.includes('question')) {
            setFacts(parsedData.callback_data?.Sachverhalt ?? '');
            setStep(QUESTION_STEPS.FACTS);
          } else {
            setStep(QUESTION_STEPS.ANSWER);
          }
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConsultant = async (disclosure: string, question: string) => {
    setIsLoading(true);
    const parameters = {
      Selbstauskunft: disclosure,
      Kernfrage: question,
    };
    try {
      const {status, data} = await apiHub.post<{Text: {response: string}}>(`api/v1/ai-functions/direct-call`, {
        name: 'init',
        parameters,
      });

      if (status === 201) {
        const parsedData: IConsultantResponse = JSON.parse(data.Text.response);
        console.log({parsedData});
        if (!parsedData.next_endpoint && !parsedData.callback_data) {
          setCanNotHelp(true);
          setResponse({result: parsedData.result});
        } else if (parsedData.callback_data && typeof parsedData.callback_data === 'string') {
          const callback_data: IConsultantResponseCallbackData = JSON.parse(parsedData.callback_data);

          const result: IConsultantChatResponseCallbackData = {
            ...callback_data,
            chat: callback_data.chat.flatMap((ch) =>
              ch.length === 2 ? {question: ch[0], answer: ch[1]} : {question: ch[0], answer: ''},
            ),
          };
          setResponse({...parsedData, callback_data: result});
        } else {
          setResponse({
            result: parsedData.result,
            next_endpoint: parsedData.next_endpoint,
          });
        }
        setStep(QUESTION_STEPS.ANSWER);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col bg-content-grey-0 pt-4 pb-5 px-5 w-full h-full min-h-[600px] rounded-20 relative `}>
        {/* <div className='flex justify-between mb-4'>
          <h1 className='text-content-grey-900 font-semibold text-xl leading-7'>Law consultant</h1>
          <IconButton className='ml-auto !p-1'>
            <XMarkIcon className='w-5 h-5 text-content-grey-900' />
          </IconButton>
        </div> */}
        {canNotHelp && response && step === QUESTION_STEPS.ANSWER && (
          <div className='w-full px-9 pt-6 md:pt-9 lg:pt-[51px] text-center flex-1'>
            <div className='p-5 md:p-8 lg:p-12 xl:p-[60px] bg-content-grey-100 rounded-20 mx-auto max-w-[691px]'>
              <h1 className='text-2xl font-semibold mb-5'>
                <span className='text-content-accent-hover'>{`Unable to assist `}</span>
                with this issue
              </h1>
              <p className='text-sm leading-[22.5px] text-content-grey-900 font-poppins-medium max-w-[571px]'>
                {response.result}
              </p>
            </div>
          </div>
        )}
        {!canNotHelp && (
          <div className={`flex flex-col md:flex-row gap-4 flex-grow mb-5`}>
            <div className='flex flex-col flex-1'>
              <div
                className={classNames(`mb-4 custom-scrollbar-thumb flex-1`, {
                  'max-h-[435px]': step === QUESTION_STEPS.ANSWER,
                  'max-h-[420px]': step === QUESTION_STEPS.FACTS || step === QUESTION_STEPS.CREATE_CONSULTATION,
                  'max-h-[282px]': step > QUESTION_STEPS.CREATE_CONSULTATION,
                })}
              >
                <div className='flex flex-col mb-4'>
                  <h2 className='text-sm text-content-accent-hover font-semibold mb-1 '>Self-disclosure:</h2>
                  {step === QUESTION_STEPS.ASK || shouldUpdate.disclosure ? (
                    <label className='flex flex-col relative'>
                      <span className='text-xs text-content-grey-900 font-poppins-regular mb-3'>
                        Provide details of the problem you are experiencing in the chat ssss
                      </span>
                      <textarea
                        rows={6}
                        maxLength={1000}
                        onInput={(e) => setDisclosure(e.currentTarget.value)}
                        value={disclosure}
                        className='bg-content-grey-100 rounded-20 resize-none outline-none focus:border-content-grey-900 pt-2 pb-4 px-4'
                      />
                      <span className='text-content-grey-400 text-xs leading-5 absolute right-4 bottom-2'>{`${disclosure.length}/1000`}</span>
                    </label>
                  ) : (
                    <div className='flex justify-between gap-2'>
                      <p className='text-xs leading-5 text-content-grey-900'>{disclosure}</p>
                      {/* <IconButton className='shrink-0 h-5 !p-0' onClick={() => handleShowEditMode('disclosure')}>
                        <PencilSquareIcon className='w-5 h-5' />
                      </IconButton> */}
                    </div>
                  )}
                </div>
                <div className='flex flex-col mb-4'>
                  <h2 className='text-sm text-content-accent-hover font-semibold mb-1 '>Core-questions:</h2>
                  {step === QUESTION_STEPS.ASK || shouldUpdate.question ? (
                    <label className='flex flex-col relative'>
                      <span className='text-xs text-content-grey-900 font-poppins-regular mb-3'>
                        Provide details on how I can help you?
                      </span>
                      <textarea
                        rows={6}
                        value={question}
                        onInput={(e) => setQuestion(e.currentTarget.value)}
                        className='bg-content-grey-100 resize-none outline-none focus:border-content-grey-900 rounded-20 pt-2 pb-4 px-4'
                      />
                      <span className='text-content-grey-400 text-xs leading-5 absolute right-4 bottom-2'>{`${question.length}/1000`}</span>
                    </label>
                  ) : (
                    <div className='flex justify-between gap-2'>
                      <p className='text-xs leading-5 text-content-grey-900'>{question}</p>
                      {/* <IconButton className='shrink-0 h-5 !p-0' onClick={() => handleShowEditMode('question')}>
                        <PencilSquareIcon className='w-5 h-5' />
                      </IconButton> */}
                    </div>
                  )}
                </div>

                {step !== QUESTION_STEPS.ASK &&
                  response &&
                  response.callback_data &&
                  typeof response.callback_data === 'object' && (
                    <AdditionalInformations
                      isLoading={isLoading}
                      chats={response.callback_data.chat}
                      doSubmit={(chat: IConsultantChat[]) => putNewAnswer(chat)}
                    />
                  )}

                {step === QUESTION_STEPS.CONSULTATION && chatArchive && (
                  <AdditionalInformations
                    isLoading={isLoading}
                    chats={chatArchive}
                    doSubmit={(chat: IConsultantChat[]) => putNewAnswer(chat)}
                  />
                )}
              </div>
              {step === QUESTION_STEPS.FACTS && (
                <p className='flex text-content-accent-hover text-xs font-semibold'>
                  Thank you for sharing the information. I am gathering crucial information into facts...
                </p>
              )}
              {step === QUESTION_STEPS.CREATE_CONSULTATION && (
                <p className='flex text-content-accent-hover text-xs font-semibold'>
                  I am creating an initial consultation...
                </p>
              )}
            </div>
            {step >= QUESTION_STEPS.FACTS && (
              <div
                className={classNames(
                  `flex flex-col flex-1 w-full max-w-md mx-auto md:mx-0 md:max-w-[260px] bg-content-grey-800 text-content-grey-100 px-4 py-3 rounded-20 custom-scrollbar-thumb`,
                  {
                    'max-h-[282px]': step === QUESTION_STEPS.CONSULTATION,
                    'max-h-[430px]': step === QUESTION_STEPS.FACTS,
                  },
                )}
              >
                <h3 className=' font-semibold mb-3 text-sm'>Facts:</h3>
                {step >= QUESTION_STEPS.FACTS && <p className='text-xs leading-5'>{facts}</p>}
              </div>
            )}
          </div>
        )}
        {step === QUESTION_STEPS.CONSULTATION && (
          <div className=' bg-content-grey-100 rounded-20 relative py-4 px-5 mb-3 h-[170px] overflow-auto custom-scrollbar-thumb'>
            <div className='flex flex-col'>
              <h3 className='text-content-accent-hover text-sm font-semibold mb-2'>Initial consulting</h3>
              <p className='text-content-grey-900 text-xs leading-5'>{response?.result}</p>
            </div>
            <span className='absolute w-full h-8 bottom-0 left-0 right-0 text-gradient-to-t from-content-grey-0 to-transparent ...' />
          </div>
        )}
        <div className='h-9'>
          {canNotHelp && step === QUESTION_STEPS.ANSWER ? (
            <Button
              title='Ask different question ss'
              onClick={handleAskDifferentQuestion}
              className='rounded-[40px] w-[220px] !h-9'
            />
          ) : (
            <>
              {step === QUESTION_STEPS.ASK && (
                <Button
                  title='Continue'
                  disabled={!disclosure || !question || isLoading}
                  loading={isLoading}
                  onClick={handleAskFirstQuestion}
                  className='rounded-[40px] w-[220px] !h-9'
                />
              )}
              {/* {step === QUESTION_STEPS.ANSWER && (
                <Button
                  title='Update information'
                  disabled={checkUpdateButtonDisabled(shouldUpdate)}
                  onClick={handleUpdateInformation}
                  className='rounded-[40px] w-[220px] !h-9'
                  iconBefore={<ArrowPathIcon className='w-5 h-5 text-content-grey-0' />}
                />
              )} 
              
              {step >= QUESTION_STEPS.FACTS && (
                <Button
                  title='Update information'
                  disabled={checkUpdateButtonDisabled(shouldUpdate)}
                  // onClick={handleUpdateInformation}
                  className='rounded-[40px] w-[220px] !h-9 '
                  iconBefore={<ArrowPathIcon className='w-5 h-5 text-content-grey-0' />}
                />
              )} */}
            </>
          )}
        </div>
      </div>
    </>
  );
};
