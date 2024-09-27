import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VoiceRecognition = ({ performAction }) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
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
      const recognition = new window.SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';  // Set language here
      recognition.onresult = (event) => {
        handleCommand(event.results[0][0].transcript);
      };
      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [isListening]);

  const handleListeningToggle = () => {
    setIsListening((prevState) => !prevState);
  };

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

VoiceRecognition.propTypes = {
  performAction: PropTypes.func.isRequired
};

export default VoiceRecognition;
