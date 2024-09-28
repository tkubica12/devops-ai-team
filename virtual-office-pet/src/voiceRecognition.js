import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';
import { voiceCommandsConfig } from './voiceCommandsConfig';

const VoiceRecognition = {
  recognizer: null,

  async initialize(language = 'en') {
    this.recognizer = speech.create('BROWSER_FFT');
    await this.recognizer.ensureModelLoaded();
    this.currentCommands = voiceCommandsConfig.commands[language] || voiceCommandsConfig.commands['en'];
  },

  start(callback, language = 'en') {
    if (!this.recognizer) {
      this.initialize(language).then(() => this.start(callback, language));
      return;
    }

    this.recognizer.listen(result => {
      const { scores } = result;
      const index = scores.indexOf(Math.max(...scores));
      const command = this.currentCommands[index];

      if (command) {
        callback(command);
      }
    }, {
      overlapFactor: 0.5,
      probabilityThreshold: 0.75
    });
  },

  stop() {
    if (this.recognizer) {
      this.recognizer.stopListening();
    }
  }
};

export default VoiceRecognition;
