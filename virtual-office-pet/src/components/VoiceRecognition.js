import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';

const VoiceRecognition = ({ performAction }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const commands = [
    {
      command: '*',
      callback: (command) => {
        const sanitizedCommand = sanitizeInput(command);
        // Multilingual command support
        if (sanitizedCommand === 'play' || sanitizedCommand === 'jouer') {
          performAction('Played');
        } else if (sanitizedCommand === 'sleep' || sanitizedCommand === 'dormir') {
          performAction('Slept');
        }
      },
    },
  ];

  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
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
    <div className="voice-recognition">
      <button 
        onClick={() => setIsListening(!isListening)} 
        className={`bg-blue-500 text-white p-2 rounded ${isListening ? 'bg-red-500' : ''}`}
      >
        {isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceRecognition;
