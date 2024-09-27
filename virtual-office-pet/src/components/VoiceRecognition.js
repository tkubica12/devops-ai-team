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
    switch (sanitizedCommand.toLowerCase()) {
      case 'play':
      case 'jouer':
      case 'spielen':
      case 'jugar':
        performAction('Played');
        break;
      case 'sleep':
      case 'dormir':
      case 'schlafen':
        performAction('Slept');
        break;
      case 'sit':
      case 'asseoir':
      case 'sitzen':
      case 'sentar':
        performAction('Sat');
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

  useEffect(() => {
    if (isListening) {
      window.SpeechRecognition.startListening({ continuous: true });
    } else {
      window.SpeechRecognition.stopListening();
      handleCommand(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  return (
    <div className="voice-recognition">
      <button 
        onClick={handleListeningToggle} 
        className={`bg-blue-500 text-white p-2 rounded ${isListening ? 'bg-red-500' : ''}`}
      >
        {isListening ? 'Stop Voice Recognition' : 'Start Voice Recognition'}
      </button>
      <p>{isListening ? 'Listening...' : 'Click the button to start voice recognition'}</p>
    </div>
  );
};

export default VoiceRecognition;
