import React, {useState, useEffect} from 'react';

let recognition: any = null;
if (typeof window !== 'undefined') {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.contiuous = true;
    recognition.lang = 'en-us';
  }
}

const useCustomSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    console.log({recognition});
    if (!recognition) return;
    console.log({recognition});
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log({event});
      setText(event.results[0][0].transcript);
      recognition.stop();
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    if (isListening) return;
    setText('');
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return {transcript: text, isListening, startListening, stopListening, hasRecognitionSupport: !!recognition};
};
export default useCustomSpeechRecognition;
