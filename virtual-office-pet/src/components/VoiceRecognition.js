import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoiceRecognition = ({ performAction }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const isMounted = useRef(false);

  const handleCommand = (command) => {
    const sanitizedCommand = sanitizeInput(command);
    switch (sanitizedCommand) {
      case 'play':
      case 'jouer':
        performAction('Played');
        break;
      case 'sleep':
      case 'dormir':
        performAction('Slept');
        break;
      default:
        toast.error('Unrecognized command');
        break;
    }
  };

  const commands = [
    {
      command: '*',
      callback: handleCommand,
    },
  ];

  const handleListeningToggle = () => {
    if (isMounted.current) setIsListening(prevState => !prevState);
  };

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

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
      <p>{isListening ? 'Listening...' : 'Click to start listening'}</p>
    </div>
  );
};

export default VoiceRecognition;
