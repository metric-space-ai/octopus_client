import {useEffect, useRef, useState} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null;
if (typeof window !== 'undefined') {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Continuous listening
    recognition.interimResults = true; // Capture interim results
    recognition.lang = 'en-US';
  }
}

const useCustomSpeechRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const silenceTimeoutRef = useRef<number | null>(null); // Using useRef to store the timeout

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setText(transcript); // Update text continuously

      // Reset the silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = window.setTimeout(() => {
        stopListening(); // Stop listening after 2 seconds of silence
      }, 2000);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart listening
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognition.stop();
    };

    // Cleanup function to clear the timeout on unmount
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [isListening]);

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
