import { useState, useEffect } from 'react';
import * as speechCommands from '@tensorflow-models/speech-commands';

export const useSpeechRecognition = () => {
  const [listening, setListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState(null);
  const [error, setError] = useState(null);
  let recognizer;

  useEffect(() => {
    const initialize = async () => {
      try {
        recognizer = await speechCommands.create('BROWSER_FFT');
        await recognizer.ensureModelLoaded();
      } catch (err) {
        setError(err.message);
        console.error('Error loading recognizer:', err);
      }
    };
    initialize();
  }, []);

  const listen = () => {
    if (!recognizer) return;

    recognizer.listen(
      result => {
        const scores = result.scores;
        const commands = recognizer.wordLabels();
        const highestScoreIndex = scores.reduce(
          (bestIndex, currentScore, index, array) =>
            currentScore > array[bestIndex] ? index : bestIndex,
          0
        );

        setVoiceCommand(commands[highestScoreIndex]);
      },
      {
        probabilityThreshold: 0.75, // could be made configurable
      }
    );
    setListening(true);
  };

  const stop = () => {
    if (recognizer) {
      recognizer.stopListening();
      setListening(false);
    }
  };

  return { listen, listening, stop, voiceCommand, error };
};
