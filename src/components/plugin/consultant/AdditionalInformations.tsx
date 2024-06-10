import React, {useEffect, useState} from 'react';
import QuestionAndAnswerRow from './QuestionAndAnswerRow';
import {IConsultantChat} from './type';


type Props = {
  // itshould be updated
  isLoading: boolean;
  chats: IConsultantChat[];
  doSubmit: (chat: IConsultantChat[]) => void;
};

const AdditionalInformations = ({chats, doSubmit, isLoading}: Props) => {
  const handleSubmitChats = (answer: string) => {
    const payload: IConsultantChat[] = [...chats].flatMap((chat, index) =>
      index + 1 === chats.length ? {...chat, answer} : chat,
    );
    doSubmit(payload);
  };
  // const handleEnableEditModeFor = (response: Conversation) => {
  //   setOpenEditAnswerFor(response.id);
  //   setAnswerInputUpdate(response.answer ?? '');
  // };
  // const handleDisableEditModeFor = () => {
  //   setOpenEditAnswerFor('');
  //   setAnswerInputUpdate('');
  // };

  // const doSubmit = (response: Conversation, answer: string) => {
  //   if (answer.trim() === '') return;
  //   const data = {...response, answer: answer};
  //   const result = [...response].flatMap((res) => (res.id === data.id ? {...res, ...data} : res));
  //   setResponses(result);
  //   handleDisableEditModeFor();
  // };

  // useEffect(() => {
  //   setInputRows(1);
  // }, [response]);

  // useEffect(() => {
  //   if (response.every((key) => key.answer)) {
  //     allQuestionAnswered();
  //   }
  // }, [response]);

  return (
    <>
      <h3 className='text-sm text-content-accent-hover font-semibold mb-1 '>Additional information:</h3>
      <div className='flex flex-col gap-6 mb-6'>
        {/* {chats.map((chat, index) => ( */}
        {chats.map((chat, index) => (
          <div className='flex flex-col text-xs leading-5 gap-2' key={`chat-id-${index}`}>
            <QuestionAndAnswerRow
              isLoading={isLoading}
              chat={chat}
              questionNumber={index + 1}
              doSubmit={(answer: string) => handleSubmitChats(answer)}
            />
            {/* {openEditAnswerFor === response.id || !response.answer ? (
              <div className='flex items-center'>
                {!response.answer && (
                  <>
                    <div className='flex flex-1 relative items-center'>
                      <textarea
                        ref={inputRef}
                        className={`w-full border py-[7px] pr-[60px] pl-5 rounded-[40px] resize-none outline-none 
                            focus:border-content-grey-900 custom-scrollbar-thumb`}
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
                      <PaperAirplaneIcon className='w-5 h-5 text-content-grey-0' />
                    </IconButton>
                  </>
                )}
                {openEditAnswerFor === response.id && (
                  <>
                    <div className='flex flex-1 relative items-center'>
                      <textarea
                        ref={inputRef}
                        className={`w-full border py-[7px] pr-[60px] pl-5 rounded-[40px] resize-none outline-none 
                            focus:border-content-grey-900 custom-scrollbar-thumb`}
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
                      <PaperAirplaneIcon className='w-5 h-5 text-content-grey-0' />
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
                  <span className='block text-content-grey-900'>{response.answer}</span>
                  <IconButton className='shrink-0 h-4 !p-0'>
                    <PencilSquareIcon
                      className='w-4 h-4 text-content-grey-900'
                      onClick={() => handleEnableEditModeFor(response)}
                    />
                  </IconButton>
                </div>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </>
  );
};
export default AdditionalInformations;