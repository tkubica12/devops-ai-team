import { useState, useEffect } from 'react';
import VoiceRecognition from './voiceRecognition';

const useSpeechRecognition = (language = 'en', threshold = 0.75) => {
  const [command, setCommand] = useState(null);

  useEffect(() => {
    try {
      VoiceRecognition.start(setCommand, language, threshold);
    } catch (error) {
      console.error('Error initializing voice recognition:', error);
    }

    return () => VoiceRecognition.stop();
  }, [language, threshold]);

  return command;
};

export default useSpeechRecognition;
