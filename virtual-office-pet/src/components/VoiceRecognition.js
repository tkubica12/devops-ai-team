import React, { useEffect, useRef } from 'react';
import validator from 'validator';

const VoiceRecognition = ({ performAction }) => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let command = event.results[0][0].transcript.toLowerCase();
      command = validator.escape(command);

      if (command.includes('play')) {
        performAction('Played');
      } else if (command.includes('sleep')) {
        performAction('Slept');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
    };

    const startRecognition = () => {
      if (isMountedRef.current) recognition.start();
    };

    startRecognition();

    return () => {
      isMountedRef.current = false;
      recognition.stop();
    };
  }, [performAction]);

  return (
    <button onClick={() => recognition.start()} className="bg-blue-500 text-white p-2 rounded">
      Start Voice Recognition
    </button>
  );
};

export default VoiceRecognition;
