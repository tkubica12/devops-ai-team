import React, { useEffect } from 'react';
import { useSpeechContext } from '@speechly/react-client';
import DOMPurify from 'dompurify';
import validator from 'validator';

const sanitizeTranscript = (transcript) => {
  const sanitized = DOMPurify.sanitize(validator.escape(transcript));
  return ['play', 'sleep'].includes(sanitized) ? sanitized : null;
};

const VoiceCommands = ({ onCommand }) => {
  const { segment } = useSpeechContext();

  useEffect(() => {
    if (segment && segment.isFinal) {
      const command = sanitizeTranscript(segment.intent.intent);
      if (command) onCommand(command.charAt(0).toUpperCase() + command.slice(1));
      console.log('Recognized command:', command);
    }
  }, [segment, onCommand]);

  return (
    <div className="voice-commands-feedback">
      {segment && <p>Listening: {segment.words.map(w => w.value).join(' ')}</p>}
    </div>
  );
};

export default VoiceCommands;
