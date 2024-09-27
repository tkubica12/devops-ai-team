import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition';
import sanitizeInput from './InputSanitizer';
import VoiceRecognitionButton from './VoiceRecognitionButton';
import VoiceRecognitionErrorHandling from './VoiceRecognitionErrorHandling';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSelector from './LanguageSelector';

const VoiceRecognition = ({ performAction }) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [errorMessage, setErrorMessage] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleCommand = (command) => {
    const sanitizedCommand = sanitizeInput(command);
    switch (sanitizedCommand.toLowerCase()) {
      case 'play':
      case 'jouer':
      case 'spielen':
      case 'jugar':
        performAction('Played');
        setFeedbackMessage('Command executed: Play');
        break;
      case 'sleep':
      case 'dormir':
      case 'schlafen':
        performAction('Slept');
        setFeedbackMessage('Command executed: Sleep');
        break;
      case 'sit':
      case 'asseoir':
      case 'sitzen':
      case 'sentar':
        performAction('Sat');
        setFeedbackMessage('Command executed: Sit');
        break;
      default:
        setErrorMessage('Unrecognized command');
        toast.error('Unrecognized command');
        break;
    }
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setErrorMessage('Speech recognition not supported in this browser');
      toast.error('Speech recognition not supported in this browser');
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = language;
      recognition.onresult = (event) => {
        handleCommand(event.results[event.results.length - 1][0].transcript);
      };
      recognition.start();

      return () => {
        recognition.stop();
      };
    }
  }, [isListening, language]);

  const handleListeningToggle = () => {
    setIsListening((prevState) => !prevState);
    setFeedbackMessage('');
    if (isListening) resetTranscript();
  };

  return (
    <div className="voice-recognition">
      <VoiceRecognitionButton 
        isListening={isListening} 
        handleListeningToggle={handleListeningToggle} 
      />
      <p>{isListening ? 'Listening...' : 'Click the button to start voice recognition'}</p>
      {feedbackMessage && <p className="text-green-600">{feedbackMessage}</p>}
      <LanguageSelector setLanguage={setLanguage} />
      <VoiceRecognitionErrorHandling errorMessage={errorMessage} />
    </div>
  );
};

VoiceRecognition.propTypes = {
  performAction: PropTypes.func.isRequired
};

export default VoiceRecognition;
