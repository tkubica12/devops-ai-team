import { useState, useEffect } from 'react';
import * as speechCommands from '@tensorflow-models/speech-commands';

export const useSpeechRecognition = () => {
  const [listening, setListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState(null);
  const recognizer = speechCommands.create('BROWSER_FFT');

  useEffect(() => {
    const loadRecognizer = async () => {
      await recognizer.ensureModelLoaded();
    };
    loadRecognizer();
  }, [recognizer]);

  const listen = () => {
    recognizer.listen(result => {
      const scores = result.scores;
      const commands = recognizer.wordLabels();
      const highestScoreIndex = scores.reduce((bestIndex, currentScore, index, array) =>
        currentScore > array[bestIndex] ? index : bestIndex, 0);

      setVoiceCommand(commands[highestScoreIndex]);
    }, { probabilityThreshold: 0.75 });
    setListening(true);
  };

  const stop = () => {
    recognizer.stopListening();
    setListening(false);
  };

  return { listen, listening, stop, voiceCommand };
};
