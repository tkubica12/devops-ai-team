import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';

const VoiceRecognition = ({ performAction }) => {
  const [isListening, setIsListening] = useState(false);
  const commands = [
    {
      command: '*',
      callback: (command) => {
        const sanitizedCommand = sanitizeInput(command);
        if (sanitizedCommand === 'play') {
          performAction('Played');
        } else if (sanitizedCommand === 'sleep') {
          performAction('Slept');
        }
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }

    return () => {
      resetTranscript();
    };
  }, [isListening, resetTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.error('Speech recognition is not supported in this browser');
    return null;
  }

  return (
    <button 
      onClick={() => setIsListening(!isListening)} 
      className={`bg-blue-500 text-white p-2 rounded ${isListening ? 'bg-red-500' : ''}`}
    >
      {isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
    </button>
  );
};

export default VoiceRecognition;
