import {Fragment, useState, useEffect} from 'react';

import {Dialog, Transition} from '@headlessui/react';
import {MicrophoneIcon, XMarkIcon,UserIcon} from '@heroicons/react/24/outline';

import {useForm} from 'react-hook-form';

import {ImagesBaseUrl} from '@/constant';

import {IconButton} from '../buttons';
import useCustomSpeechRecognition from '@/hooks/useCustomSpeechRecognition';
import {AnimateDots, LogoIcon} from '../svgs';
import {useAuthContext} from '@/contexts/authContext';

// import speehOnSoundEffect from './../../../public/sounds/speech-on.mp3';
// import speehOffSoundEffect from './../../../public/sounds/speech-off.mp3';
// import {createSpeechlySpeechRecognition} from '@speechly/speech-recognition-polyfill';
// import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInputs {
  name: string;
  id: number;
}

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
    return <span>Browser doesn't support speech recognition.</span>;
  }

  // const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();

  // if (!browserSupportsSpeechRecognition) {
  //   return <span>Browser doesn't support speech recognition.</span>;
  // }

  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInputs>();

  const onSubmit = async (data: IFormInputs) => {
    const {name, id} = data;
    setLoading(true);
    setLoading(false);
  };
  const handleStartVoiceRecognition = () => {
    // speehOnSoundEffect.play();
    startListening();
  };
  useEffect(() => {
    const timeOutfirstListening = setTimeout(handleStartVoiceRecognition, 1500);
    return () => clearTimeout(timeOutfirstListening);
  }, []);
  useEffect(() => {
    if (step === 3) {
      const timeOutfirstListening = setTimeout(handleStartVoiceRecognition, 1500);
      return () => clearTimeout(timeOutfirstListening);
    }
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
            <div className='fixed inset-0 bg-black/50 transition-opacity' />
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
                  className='w-full max-w-[720px] transform border border-content-primary flex flex-col bg-content-grey-100 px-10 py-10 gap-6 rounded-[20px]
                     align-middle shadow-xl transition-all'
                >
                  <div className='flex justify-between items-start mb-2'>
                    <Dialog.Title
                      as='h3'
                      className='text-2xl font-semibold text-content-black font-poppins-semibold text-left'
                    >
                      Hands-free mode
                    </Dialog.Title>
                    <IconButton className='top-4 right-4' onClick={onClose}>
                      <XMarkIcon className='w-5 h-5 text-content-primary' />
                    </IconButton>
                  </div>
                  <div className='flex gap-7 items-center'>
                    <div
                      className={`w-12 h-12 rounded-full relative ${
                        isListening && step === 1 ? 'animate-ring-3s ring-4 ring-content-accent/[0.11]' : ''
                      }`}
                    >
                      {user?.photo_file_name?
                      <img
                        className={`rounded-full w-12 h-12 relative ${
                          isListening && step === 1 ? 'ring-4 ring-content-accent/[0.15] animate-ring-5s' : ''
                        }`}
                        src={`${ImagesBaseUrl}${user?.photo_file_name}`}
                      />:
                      <UserIcon className={`rounded-full w-12 h-12 relative text-content-grey-100 ${
                        isListening && step === 1 ? 'ring-4 ring-content-accent/[0.15] animate-ring-5s' : ''
                      }`} />

                      }
                      <span
                        onClick={step === 1 ? (isListening ? stopListening : handleStartVoiceRecognition) : () => {}}
                        className={`${
                          isListening && step === 1 ? 'bg-content-red-600' : 'bg-white'
                        } rounded-full w-5 h-5 flex items-center justify-center absolute bottom-0 right-0 ${
                          step === 1 ? 'cursor-pointer' : ''
                        }`}
                      >
                        <MicrophoneIcon
                          width={14}
                          height={14}
                          className={isListening && step === 1 ? 'text-white' : 'text-content-black'}
                        />
                      </span>
                    </div>
                    <div className=' text-content-grey-600 flex items-center'>
                      <p>{step === 1 ? (transcript ? transcript : 'Go a head. I’m listening...') : firstQuestion}</p>
                    </div>
                  </div>

                  {step > 1 && (
                    <div className='flex gap-7'>
                      <div
                        className={`bg-content-black w-12 h-12 rounded-full relative flex items-center justify-center ${
                          answerIsLoading ? 'animate-ring-3s ring-4 ring-content-accent/[0.11]' : ''
                        }`}
                      >
                        <LogoIcon width={28} height={28} color='#F5F5F5' />

                        <span
                          className={`bg-white rounded-full w-5 h-5 flex items-center justify-center absolute bottom-0 right-0 ${
                            answerIsLoading ? 'animate-ring-3s ring-4 ring-content-accent/[0.11]' : ''
                          }`}
                        >
                          <MicrophoneIcon width={14} height={14} className={'text-content-black'} />
                        </span>
                      </div>
                      <div className=' flex items-center px-5 py-3 rounded-b-20 rounded-tr-20 bg-content-black my-auto'>
                        {answerIsLoading ? (
                          <AnimateDots />
                        ) : (
                          <p className='text-content-grey-100 text-left'>{GPTAnswer}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {step > 2 && (
                    <div className='flex gap-7 items-center mb-6'>
                      <div
                        className={`w-12 h-12 rounded-full relative ${
                          isListening && step === 3 ? 'animate-ring-3s ring-4 ring-content-accent/[0.11]' : ''
                        }`}
                      >
                        <img
                          className={`rounded-full w-12 h-12 relative ${
                            isListening && step === 3 ? 'ring-4 ring-content-accent/[0.15] animate-ring-5s' : ''
                          }`}
                          src={`${ImagesBaseUrl}${user?.photo_file_name}`}
                        />
                        <span
                          onClick={step === 3 ? (isListening ? stopListening : handleStartVoiceRecognition) : () => {}}
                          className={`${
                            isListening && step === 3 ? 'bg-content-red-600' : 'bg-white'
                          } rounded-full w-5 h-5 flex items-center justify-center absolute bottom-0 right-0 ${
                            step === 3 ? 'cursor-pointer' : ''
                          }`}
                        >
                          <MicrophoneIcon
                            width={14}
                            height={14}
                            className={isListening && step === 3 ? 'text-white' : 'text-content-black'}
                          />
                        </span>
                      </div>
                      <div className=' text-content-grey-600 flex items-center'>
                        <p>{transcript ? transcript : 'Go a head. I’m listening...'}</p>
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
