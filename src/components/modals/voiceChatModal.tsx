/* eslint-disable react-hooks/rules-of-hooks */
import {Fragment, useEffect, useState} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {MicrophoneIcon, UserIcon, XMarkIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';

import {ImagesBaseUrl} from '@/constant';
import {useAuthContext} from '@/contexts/authContext';
import useCustomSpeechRecognition from '@/hooks/useCustomSpeechRecognition';

import {IconButton} from '../buttons';
import {AnimateDots, LogoIcon} from '../svgs';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

// interface IFormInputs {
//   name: string;
//   id: number;
// }

export const VoiceChatModal = ({open, onClose}: ModalProps) => {
  const [loading, setLoading] = useState(false);
  const [answerIsLoading, setAnswerIsLoading] = useState(false);
  const [GPTAnswer, setGPTAnswer] = useState('');
  const [firstQuestion, setFirstQuestion] = useState('');
  const [step, setStep] = useState(1);
  const {transcript, isListening, startListening, stopListening, hasRecognitionSupport} = useCustomSpeechRecognition();
  const {user} = useAuthContext();

  // const appId = '';
  // const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
  // SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

  //   const {transcript, listening, browserSupportsSpeechRecognition} = useSpeechRecognition();
  //   const startListening = () => SpeechRecognition.startListening();

  if (!hasRecognitionSupport) {
    return <span>{`Browser doesn't support speech recognition.`}</span>;
  }

  // const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();

  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  // const {
  //   register,
  //   setValue,
  //   handleSubmit,
  //   formState: {errors},
  // } = useForm<IFormInputs>();

  // const onSubmit = async (data: IFormInputs) => {
  //   const {name, id} = data;
  //   // setLoading(true);
  //   // setLoading(false);
  // };
  const handleStartVoiceRecognition = () => {
    // speehOnSoundEffect.play();
    startListening();
  };
  useEffect(() => {
    const timeOutfirstListening = setTimeout(handleStartVoiceRecognition, 1500);
    return () => clearTimeout(timeOutfirstListening);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (step === 3) {
      const timeOutfirstListening = setTimeout(handleStartVoiceRecognition, 1500);
      return () => clearTimeout(timeOutfirstListening);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    const handleGetAnswer = () => {
      setGPTAnswer('Thank you. Is there anything else?');
      setStep(3);
      setAnswerIsLoading(false);
      setLoading(false);
    };
    if (!isListening && transcript.length > 0 && step === 1) {
      setAnswerIsLoading(true);
      setLoading(true);
      setFirstQuestion(transcript);
      setStep(2);
      const timeOutfirstListening = setTimeout(handleGetAnswer, 1500);
      return () => clearTimeout(timeOutfirstListening);
    }
    if (transcript.includes('no')) {
      const timeOutCloseModal = setTimeout(() => {
        setLoading(false);
        setAnswerIsLoading(false);
        setGPTAnswer('');
        setFirstQuestion('');
        setStep(1);
        onClose();
      }, 1500);
      return () => clearTimeout(timeOutCloseModal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog className='relative z-10' as='div' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-grey-900/50 transition-opacity' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-12 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className='w-full max-w-[720px] transform border border-content-primary flex flex-col bg-grey-100 px-10 py-10 gap-6 rounded-xl
                     align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-2'>
                    <Dialog.Title as='h3' className='text-2xl font-semibold text-grey-900 text-left'>
                      Hands-free mode
                    </Dialog.Title>
                    <IconButton className='top-4 right-4' onClick={onClose}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex gap-7 items-center'>
                    <div
                      className={`w-12 h-12 rounded-full relative ${
                        isListening && step === 1 ? 'animate-ring-3s ring-4 ring-primary/[0.11]' : ''
                      }`}
                    >
                      {user?.photo_file_name ? (
                        <Image
                          width={48}
                          height={48}
                          alt={'user'}
                          className={`rounded-full w-12 h-12 relative ${
                            isListening && step === 1 ? 'ring-4 ring-primary/[0.15] animate-ring-5s' : ''
                          }`}
                          src={`${ImagesBaseUrl}${user.photo_file_name}`}
                        />
                      ) : (
                        <UserIcon
                          className={`rounded-full w-12 h-12 relative text-grey-100 ${
                            isListening && step === 1 ? 'ring-4 ring-primary/[0.15] animate-ring-5s' : ''
                          }`}
                        />
                      )}
                      <span
                        onClick={
                          step === 1
                            ? isListening
                              ? stopListening
                              : handleStartVoiceRecognition
                            : () => console.warn('accessible denied')
                        }
                        className={classNames(
                          'rounded-full w-5 h-5 flex items-center justify-center absolute bottom-0 right-0',
                          isListening && step === 1 ? 'bg-danger-500' : 'bg-grey-0',
                          step === 1 && 'cursor-pointer',
                          loading && 'pointer-events-none',
                        )}
                      >
                        <MicrophoneIcon
                          width={14}
                          height={14}
                          className={isListening && step === 1 ? 'text-grey-0' : 'text-grey-900'}
                        />
                      </span>
                    </div>
                    <div className=' text-grey-600 flex items-center'>
                      <p>{step === 1 ? (transcript ? transcript : `Go a head. I'm listening...`) : firstQuestion}</p>
                    </div>
                  </div>

                  {step > 1 && (
                    <div className='flex gap-7'>
                      <div
                        className={`bg-grey-900 w-12 h-12 rounded-full relative flex items-center justify-center ${
                          answerIsLoading ? 'animate-ring-3s ring-4 ring-primary/[0.11]' : ''
                        }`}
                      >
                        <LogoIcon width={28} height={28} color='#F5F5F5' />

                        <span
                          className={`bg-grey-0 rounded-full w-5 h-5 flex items-center justify-center absolute bottom-0 right-0 ${
                            answerIsLoading ? 'animate-ring-3s ring-4 ring-primary/[0.11]' : ''
                          }`}
                        >
                          <MicrophoneIcon width={14} height={14} className={'text-grey-900'} />
                        </span>
                      </div>
                      <div className=' flex items-center px-5 py-3 rounded-b-xl rounded-tr-xl bg-grey-900 my-auto'>
                        {answerIsLoading ? <AnimateDots /> : <p className='text-grey-100 text-left'>{GPTAnswer}</p>}
                      </div>
                    </div>
                  )}
                  {step > 2 && (
                    <div className='flex gap-7 items-center mb-6'>
                      <div
                        className={`w-12 h-12 rounded-full relative ${
                          isListening && step === 3 ? 'animate-ring-3s ring-4 ring-primary/[0.11]' : ''
                        }`}
                      >
                        <Image
                          width={48}
                          height={48}
                          alt={'user'}
                          className={`rounded-full w-12 h-12 relative ${
                            isListening && step === 3 ? 'ring-4 ring-primary/[0.15] animate-ring-5s' : ''
                          }`}
                          src={`${ImagesBaseUrl}${user?.photo_file_name}`}
                        />
                        <span
                          onClick={
                            step === 3
                              ? isListening
                                ? stopListening
                                : handleStartVoiceRecognition
                              : () => console.warn('button is disabled')
                          }
                          className={`${
                            isListening && step === 3 ? 'bg-danger-500' : 'bg-grey-0'
                          } rounded-full w-5 h-5 flex items-center justify-center absolute bottom-0 right-0 ${
                            step === 3 ? 'cursor-pointer' : ''
                          }`}
                        >
                          <MicrophoneIcon
                            width={14}
                            height={14}
                            className={isListening && step === 3 ? 'text-grey-0' : 'text-grey-900'}
                          />
                        </span>
                      </div>
                      <div className=' text-grey-600 flex items-center'>
                        <p>{transcript ? transcript : `Go a head. I'm listening...`}</p>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
