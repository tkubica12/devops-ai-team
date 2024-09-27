import React, { useEffect, useRef } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import validator from 'validator';

const VoiceRecognition = ({ performAction }) => {
  const commands = [
    {
      command: 'play',
      callback: () => performAction('Played')
    },
    {
      command: 'sleep',
      callback: () => performAction('Slept')
    }
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  useEffect(() => {
    return () => {
      resetTranscript();
    };
  }, [resetTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log('Speech recognition is not supported in this browser');
    return null;
  }

  return (
    <button onClick={() => SpeechRecognition.startListening({ continuous: true })} className="bg-blue-500 text-white p-2 rounded">
      Start Voice Recognition
    </button>
  );
};

export default VoiceRecognition;
