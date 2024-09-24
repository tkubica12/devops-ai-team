import React, { useEffect } from 'react';
import validator from 'validator';

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
      let command = event.results[0][0].transcript.toLowerCase();
      command = validator.escape(command); // Sanitize the input
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

    return () => {
      recognition.stop();
    };
  }, [performAction]);

  return (
    <button onClick={() => recognition.start()} className="bg-blue-500 text-white p-2 rounded">
      Start Voice Recognition
    </button>
  );
};

export default VoiceRecognition;
