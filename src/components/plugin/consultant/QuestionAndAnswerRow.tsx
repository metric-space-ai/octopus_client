import {IconButton} from '@/components/buttons';
import React, {useEffect, useRef, useState} from 'react';
import {IConsultantChat} from './type';
import {useDebouncedCallback} from 'use-debounce';
import {autoGrowTextArea} from '@/helpers';
import {PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {Spinner} from '@/components/spinner';


type Props = {
  isLoading: boolean;
  chat: IConsultantChat;
  questionNumber: number;
  doSubmit: (answer: string) => void;
};

const QuestionAndAnswerRow = ({isLoading, chat, questionNumber, doSubmit}: Props) => {
  const [answerInput, setAnswerInput] = useState('');
  const [inputRows, setInputRows] = useState(1);

  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!answerInput) return false;
    if (e.key !== 'Enter') return false;
    if (e.key === 'Enter' && e.nativeEvent.isComposing) return false;
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      handleSubmit;
      e.preventDefault();
    }
  };

  const onInput = (text: string) => {
    setAnswerInput(text);
  };

  const handleSubmit = () => {
    doSubmit(answerInput);
  };
  return (
    <>
      <div className='flex gap-1'>
        <span className='block min-w-[72px] text-content-grey-600 font-semibold'>{`Question ${questionNumber}`}</span>
        <span className='block text-content-black'>{chat.question}</span>
      </div>
      {chat.answer ? (
        <div className='flex gap-2'>
          <div className='flex gap-1'>
            <span className='block min-w-[72px] text-content-grey-600 font-semibold'>{`Answer ${questionNumber}`}</span>
            <span className='block text-content-black'>{chat.answer}</span>
            {/* <IconButton className='shrink-0 h-4 !p-0'>
                <PencilSquareIcon
                  className='w-4 h-4 text-content-black'
                  onClick={() => handleEnableEditModeFor(response)}
                />
              </IconButton> */}
          </div>
        </div>
      ) : (
        <div className='flex items-center relative'>
          <div className='flex flex-1 items-center'>
            <textarea
              ref={inputRef}
              className={`w-full border py-[7px] pr-[60px] pl-5 rounded-[40px] resize-none outline-none 
                focus:border-content-black custom-scrollbar-thumb`}
              placeholder='Provide an answer here...'
              onInput={(e) => setAnswerInput(e.currentTarget.value)}
              value={answerInput}
              onKeyDown={onInputKeyDown}
              rows={inputRows}
              autoFocus={true}
            />
            <span className='text-content-grey-400 text-xs absolute right-12'>{`${answerInput.length}/300`}</span>
          </div>
          <IconButton
            className='!p-2 absolute right-0.5'
            variant={isLoading ? 'disabled' : 'default'}
            disabled={!answerInput || isLoading}
            loading={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner size='small'  /> : <PaperAirplaneIcon className='w-5 h-5 text-content-grey-600' />}
          </IconButton>
        </div>
      )}
    </>
  );
};

export default QuestionAndAnswerRow;
