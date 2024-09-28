import { useState, useEffect } from 'react';
import VoiceRecognition from './voiceRecognition';
import Modal from './components/ui/Modal';

const useSpeechRecognition = (language = 'en', threshold = 0.75) => {
  const [command, setCommand] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      VoiceRecognition.start(setCommand, language, threshold);
    } catch (err) {
      console.error('Error initializing voice recognition:', err.message);
      setError('Voice recognition initialization failed. Please try again.');
      setShowModal(true);
    }

    return () => VoiceRecognition.stop();
  }, [language, threshold]);

  return { command, error, showModal, setShowModal };
};

export default useSpeechRecognition;
