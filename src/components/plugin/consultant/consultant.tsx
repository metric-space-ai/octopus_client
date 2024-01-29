import {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';

import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {Button, IconButton} from '../../buttons';
import {useDebouncedCallback} from 'use-debounce';
import {autoGrowTextArea} from '@/helpers';

const ADDITIONAL_INFORMATION_STEPS = {ANSWERING: 1, FACTS: 2};

type Conversation = {
  id: string;
  question: string;
  answer: null | string;
};
const RESPONSECONVERSATION: Conversation[] = [
  {id: 'response-1', question: 'When exactly did you buy the car?', answer: 'On May 19, 2019.'},
  {
    id: 'response-2',
    question: 'Are there witnesses to the dealer’s verbal assurance?',
    answer: 'Yes, my partner was present.',
  },
  {
    id: 'response-3',
    question: 'Do you have a written purchase confirmation or invoice?',
    answer: 'Yes, I have received an invoice',
  },
  {
    id: 'response-4',
    question: 'Was a warranty or guarantee verbally or contractually assured?',
    answer: 'A warranty was verbally assured, but nothing is stated in the contract.',
  },
  {
    id: 'response-5',
    question: 'Have you had the engine fault checked by a professional workshop?',
    answer: 'Yes, the workshop confirmed the engine fault',
  },
  {
    id: 'response-6',
    question: 'Have you had the engine fault checked by a professional workshop?',
    answer: null,
  },
];

interface IAditionalInfo {
  allQuestionAnswered: () => void;
}

const AdditionalInformations = ({allQuestionAnswered}: IAditionalInfo) => {
  const [informationSteps, setInformationSteps] = useState(ADDITIONAL_INFORMATION_STEPS.ANSWERING);

  const [responses, setResponses] = useState(RESPONSECONVERSATION);
  const [openEditAnswerFor, setOpenEditAnswerFor] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [answerInputUpdate, setAnswerInputUpdate] = useState('');
  const [inputRows, setInputRows] = useState(1);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleEnableEditModeFor = (response: Conversation) => {
    setOpenEditAnswerFor(response.id);
    setAnswerInputUpdate(response.answer ?? '');
  };
  const handleDisableEditModeFor = () => {
    setOpenEditAnswerFor('');
    setAnswerInputUpdate('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, value: string, response: Conversation) => {
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      doSubmit(response, value);
      e.preventDefault();
    }
  };

  const onInput = (text: string) => {
    setAnswerInput(text);
  };

  const doSubmit = (response: Conversation, answer: string) => {
    if (answer.trim() === '') return;
    const data = {...response, answer: answer};
    const result = [...responses].flatMap((res) => (res.id === data.id ? {...res, ...data} : res));
    setResponses(result);
    handleDisableEditModeFor();
  };

  const measure = useDebouncedCallback(
    () => {
      const rows = inputRef.current ? autoGrowTextArea(inputRef.current) : 1;
      const inputRows = Math.min(20, Math.max(1, rows));
      setInputRows(inputRows);
    },
    100,
    {
      leading: true,
      trailing: true,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, [answerInput]);
  useEffect(() => {
    setInputRows(1);
  }, [responses]);

  useEffect(() => {
    if (responses.every((key) => key.answer)) {
      allQuestionAnswered();
    }
  }, [responses]);

  return (
    <>
      <h3 className='text-sm text-content-accent-hover font-semibold mb-1 ' onClick={() => console.log({responses})}>
        Additional information:
      </h3>
      <div className='flex flex-col gap-6 mb-6'>
        {responses.map((response, index) => (
          <div className='flex flex-col text-xs leading-5 gap-2'>
            <div className='flex gap-1'>
              <span className='block min-w-[72px] text-content-grey-600 font-semibold'>{`Question ${index + 1}`}</span>
              <span className='block text-content-black'>{response.question}</span>
            </div>

            {openEditAnswerFor === response.id || !response.answer ? (
              <div className='flex items-center'>
                {!response.answer && (
                  <>
                    <div className='flex flex-1 relative items-center'>
                      <textarea
                        ref={inputRef}
                        className={`w-full border py-[7px] pr-[60px] pl-5 rounded-[40px] resize-none outline-none 
                            focus:border-content-black custom-scrollbar-thumb`}
                        placeholder='Provide an answer here...'
                        onInput={(e) => setAnswerInput(e.currentTarget.value)}
                        value={answerInput}
                        onKeyDown={(e) => onInputKeyDown(e, answerInput, response)}
                        rows={inputRows}
                        autoFocus={true}
                      />
                      <span className='text-content-grey-400 text-xs absolute right-3'>{`${answerInput.length}/300`}</span>
                    </div>
                    <IconButton
                      className='!p-2'
                      variant='primary'
                      disabled={!answerInput}
                      onClick={() => doSubmit(response, answerInput)}
                    >
                      <PaperAirplaneIcon className='w-5 h-5 text-white' />
                    </IconButton>
                  </>
                )}
                {openEditAnswerFor === response.id && (
                  <>
                    <div className='flex flex-1 relative items-center'>
                      <textarea
                        ref={inputRef}
                        className={`w-full border py-[7px] pr-[60px] pl-5 rounded-[40px] resize-none outline-none 
                            focus:border-content-black custom-scrollbar-thumb`}
                        placeholder='Provide an answer here...'
                        onInput={(e) => setAnswerInputUpdate(e.currentTarget.value)}
                        value={answerInputUpdate}
                        onKeyDown={(e) => onInputKeyDown(e, answerInputUpdate, response)}
                        rows={inputRows}
                        autoFocus={true}
                      />
                      <span className='text-content-grey-400 text-xs absolute right-3'>{`${answerInputUpdate.length}/300`}</span>
                    </div>
                    <IconButton
                      className='!p-2'
                      variant='primary'
                      disabled={!answerInputUpdate}
                      onClick={() => doSubmit(response, answerInputUpdate)}
                    >
                      <PaperAirplaneIcon className='w-5 h-5 text-white' />
                    </IconButton>
                  </>
                )}
              </div>
            ) : (
              <div className='flex gap-2'>
                <div className='flex gap-1'>
                  <span className='block min-w-[72px] text-content-grey-600 font-semibold'>{`Answer ${
                    index + 1
                  }`}</span>
                  <span className='block text-content-black'>{response.answer}</span>
                  <IconButton className='shrink-0 h-4 !p-0'>
                    <PencilSquareIcon
                      className='w-4 h-4 text-content-black'
                      onClick={() => handleEnableEditModeFor(response)}
                    />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const QUESTION_STEPS = {ASK: 1, ANSWER: 2, FACTS: 3, CREATE_CONSULTATION: 4, CONSULTATION: 5};

interface IConsult {}
export const Consultant = ({}: IConsult) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [step, setStep] = useState(QUESTION_STEPS.ASK);

  const [disclosure, setDisclosure] = useState('');
  const [question, setQuestion] = useState('');

  const [shouldUpdate, setShouldUpdate] = useState({
    question: false,
    disclosure: false,
  });

  const handleShowEditMode = (fieldName: keyof typeof shouldUpdate) => {
    setShouldUpdate((prev) => ({...prev, [fieldName]: true}));
  };
  const handleAskFirstQuestion = () => {
    setStep(QUESTION_STEPS.ANSWER);
    setIsUpdated(true);
  };
  const checkUpdateButtonDisabled = (obj: object) =>
    (Object.keys(obj) as Array<keyof typeof obj>).every((key) => !obj[key]);

  const handleUpdateInformation = () => {
    setShouldUpdate({disclosure: false, question: false});
  };

  const allQuestionIsAnswered = () => {
    setStep(QUESTION_STEPS.FACTS);
  };

  useEffect(() => {
    // if (step === QUESTION_STEPS.FACTS) {
    //   const countdown = () => {
    //     setStep(QUESTION_STEPS.CREATE_CONSULTATION);
    //     console.log('QUESTION_STEPS.CREATE_CONSULTATION');
    //   };
    //   setTimeout(countdown, 5000);
    // }
    // if (step === QUESTION_STEPS.CREATE_CONSULTATION) {
    //   const countdown = () => {
    //     setStep(QUESTION_STEPS.CONSULTATION);
    //     console.log('QUESTION_STEPS.CONSULTATION');
    //   };
    //   setTimeout(countdown, 5000);
    // }
    console.log(`QUESTION_STEPS...${step}`);
  }, [step]);

  return (
    <>
      <div className={`flex flex-col bg-white py-4 px-5 w-full lg:h-[600px] rounded-20 relative `}>
        <div className='flex justify-between mb-4'>
          <h1 className='text-content-black font-semibold text-xl leading-7'>Law consultant</h1>
          <IconButton className='ml-auto !p-1'>
            <XMarkIcon className='w-5 h-5 text-content-black' />
          </IconButton>
        </div>
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
                    <span className='text-xs text-content-black font-poppins-regular mb-3'>
                      Provide details of the problem you are experiencing in the chat
                    </span>
                    <textarea
                      rows={6}
                      maxLength={1000}
                      onInput={(e) => setDisclosure(e.currentTarget.value)}
                      value={disclosure}
                      className='bg-content-grey-100 rounded-20 resize-none outline-none focus:border-content-black pt-2 pb-4 px-4'
                    />
                    <span className='text-content-grey-400 text-xs leading-5 absolute right-4 bottom-2'>{`${disclosure.length}/1000`}</span>
                  </label>
                ) : (
                  <div className='flex justify-between gap-2'>
                    <p className='text-xs leading-5 text-content-black'>{disclosure}</p>
                    <IconButton className='shrink-0 h-5 !p-0' onClick={() => handleShowEditMode('disclosure')}>
                      <PencilSquareIcon className='w-5 h-5' />
                    </IconButton>
                  </div>
                )}
              </div>
              <div className='flex flex-col mb-4'>
                <h2 className='text-sm text-content-accent-hover font-semibold mb-1 '>Core-questions:</h2>
                {step === QUESTION_STEPS.ASK || shouldUpdate.question ? (
                  <label className='flex flex-col relative'>
                    <span className='text-xs text-content-black font-poppins-regular mb-3'>
                      Provide details on how I can help you?
                    </span>
                    <textarea
                      rows={6}
                      value={question}
                      onInput={(e) => setQuestion(e.currentTarget.value)}
                      className='bg-content-grey-100 resize-none outline-none focus:border-content-black rounded-20 pt-2 pb-4 px-4'
                    />
                    <span className='text-content-grey-400 text-xs leading-5 absolute right-4 bottom-2'>{`${question.length}/1000`}</span>
                  </label>
                ) : (
                  <div className='flex justify-between gap-2'>
                    <p className='text-xs leading-5 text-content-black'>{question}</p>
                    <IconButton className='shrink-0 h-5 !p-0' onClick={() => handleShowEditMode('question')}>
                      <PencilSquareIcon className='w-5 h-5' />
                    </IconButton>
                  </div>
                )}
              </div>
              {step !== QUESTION_STEPS.ASK && <AdditionalInformations allQuestionAnswered={allQuestionIsAnswered} />}
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
                `flex flex-col flex-1 w-full max-w-md mx-auto md:mx-0 md:max-w-[260px] bg-content-grey-900 text-content-grey-100 px-4 py-3 rounded-20 custom-scrollbar-thumb`,
                {
                  'max-h-[282px]': step === QUESTION_STEPS.CONSULTATION,
                },
              )}
            >
              <h3 className=' font-semibold mb-3 text-sm'>Facts:</h3>
              {step > QUESTION_STEPS.FACTS && (
                <p className='text-xs leading-5'>
                  {` The buyer purchased a used vehicle from a dealer on May 15, 2019. The dealer verbally assured that the
              vehicle was in perfect condition, which can also be confirmed by a witness. `}
                  <br />
                  <br />
                  {` After about six months and
              around 10,000 kilometers driven, a significant engine fault occurred.`}
                  <br />
                  <br />
                  {` A workshop report confirms this
              fault. The buyer has only verbally asked the dealer to cover the repair costs so far. There is an invoice
              as well as a service history of the car.`}
                </p>
              )}
            </div>
          )}
        </div>
        {step === QUESTION_STEPS.CONSULTATION && (
          <div className='flex flex-col py-4 px-5 bg-content-grey-100 rounded-20 lg:h-[170px] overflow-auto custom-scrollbar-thumb mb-3'>
            <h3 className='text-content-accent-hover text-sm font-semibold mb-2'>Initial consulting</h3>
            <p className='text-xs'>
              Although verbal agreements are in principle binding, proof is often problematic. However, in your case,
              you have a witness, which could strengthen your position. According to German contract law, specifically
              the law of sales, the seller is generally liable for defects that already existed at the time of sale. Due
              to the temporal proximity between the purchase and the occurrence of the engine fault, as well as the low
              mileage, it could be argued that the defect already existed at the time of purchase.
              <br />
              <br />
              However, it will depend on how exactly the ‘warranty’ was verbally formulated and whether it can be
              considered binding. It would be advisable to formally request in writing that the dealer fix the defect
              within a set deadline. Should the dealer not comply, legal steps could be initiated. Considering the
              complexity, it would be sensible to plan further legal steps together.
            </p>
          </div>
        )}
        <div className='h-9'>
          {step === QUESTION_STEPS.ASK && (
            <Button
              title='Continue'
              disabled={!disclosure || !question}
              onClick={handleAskFirstQuestion}
              className='rounded-[40px] w-[220px] !h-9'
            />
          )}
          {step === QUESTION_STEPS.ANSWER && (
            <Button
              title='Update information'
              disabled={checkUpdateButtonDisabled(shouldUpdate)}
              onClick={handleUpdateInformation}
              className='rounded-[40px] w-[220px] !h-9'
              iconBefore={<ArrowPathIcon className='w-5 h-5 text-white' />}
            />
          )}
          {step >= QUESTION_STEPS.FACTS && (
            <Button
              title='Update information'
              disabled={checkUpdateButtonDisabled(shouldUpdate)}
              // onClick={handleUpdateInformation}
              className='rounded-[40px] w-[220px] !h-9 '
              iconBefore={<ArrowPathIcon className='w-5 h-5 text-white' />}
            />
          )}
        </div>
      </div>
    </>
  );
};
