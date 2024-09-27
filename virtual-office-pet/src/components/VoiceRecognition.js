import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoiceRecognition = ({ performAction }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
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

  const handleListeningToggle = () => {
    if (isMounted.current) setIsListening((prevState) => !prevState);
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
    }
  }, [browserSupportsSpeechRecognition]);

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
