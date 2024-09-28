import React from 'react';
import { Button } from './ui/Button';

const VoiceCommands = ({ onCommand }) => {
  // Simulate real voice command handling or integrate a third-party service here.

  return (
    <div>
      <h3>Voice Commands</h3>
      <Button onClick={() => onCommand('play')}>Play Command</Button>
      <Button onClick={() => onCommand('sleep')}>Sleep Command</Button>
    </div>
  );
};

export default VoiceCommands;
