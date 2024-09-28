import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';

const VOICE_COMMANDS = ['feed', 'talk', 'play'];

const VoiceRecognition = {
  recognizer: null,

  async initialize() {
    this.recognizer = speech.create('BROWSER_FFT');
    await this.recognizer.ensureModelLoaded();
  },

  start(callback) {
    if (!this.recognizer) {
      this.initialize().then(() => this.start(callback));
      return;
    }

    this.recognizer.listen(result => {
      const { scores } = result;
      const index = scores.indexOf(Math.max(...scores));
      const command = VOICE_COMMANDS[index];

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
