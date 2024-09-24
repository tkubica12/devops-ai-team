import React, { useEffect } from 'react';

const VoiceRecognition = ({ performAction }) => {
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log(`Command: ${command}`);

      if (command.includes('play')) {
        performAction('Played');
      } else if (command.includes('sleep')) {
        performAction('Slept');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
    };

    const startRecognition = () => {
      recognition.start();
    };

    document.addEventListener('click', startRecognition);

    return () => {
      document.removeEventListener('click', startRecognition);
      recognition.stop();
    };
  }, [performAction]);

  return <div className="voice-recognition-info">Click anywhere to start voice command recognition.</div>;
};

export default VoiceRecognition;
