import React, { useEffect } from 'react';
import { Button } from './ui/Button';

const VoiceCommands = ({ onCommand }) => {
  useEffect(() => {
    const handleVoiceCommand = (command) => {
      console.log(`Voice command received: ${command}`);
      // Call the onCommand callback with the command
      onCommand(command);
    };

    // Dummy implementation for recognizing voice commands
    // In real implementation, this would be replaced with actual voice recognition logic
    const commands = ['play', 'sleep'];
    commands.forEach((command) => {
      setTimeout(() => handleVoiceCommand(command), 3000);
    });

    return () => {
      // Clean up resources, if any
    };
  }, [onCommand]);

  return (
    <div>
      <h3>Voice Commands</h3>
      <Button onClick={() => onCommand('play')}>Play Command</Button>
      <Button onClick={() => onCommand('sleep')}>Sleep Command</Button>
    </div>
  );
};

export default VoiceCommands;
