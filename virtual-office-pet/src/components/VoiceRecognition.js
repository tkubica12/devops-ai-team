import React, { useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';

const VoiceRecognition = ({ performAction }) => {
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
    return () => {
      resetTranscript();
    };
  }, [resetTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.error('Speech recognition is not supported in this browser');
    return null;
  }

  return (
    <button onClick={() => SpeechRecognition.startListening({ continuous: true })} className="bg-blue-500 text-white p-2 rounded">
      Start Voice Recognition
    </button>
  );
};

export default VoiceRecognition;
