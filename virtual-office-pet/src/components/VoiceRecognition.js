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
      window.SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    } else {
      window.SpeechRecognition.stopListening();
    }
    return () => {
      resetTranscript();
    };
  }, [isListening, resetTranscript]);

  const handleListeningToggle = () => {
    setIsListening(prevState => !prevState);
  };

  if (!window.SpeechRecognition.browserSupportsSpeechRecognition()) {
    alert('Speech recognition is not supported in this browser');
    return null;
  }

  return (
    <div className="voice-recognition">
      <button 
        onClick={handleListeningToggle} 
        className={`bg-blue-500 text-white p-2 rounded ${isListening ? 'bg-red-500' : ''}`}
      >
        {isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceRecognition;
