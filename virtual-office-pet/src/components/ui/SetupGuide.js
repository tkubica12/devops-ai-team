import React from 'react';

const SetupGuide = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold">Setup Guide for Voice Commands</h3>
      <p className="mt-2">To enable voice commands, please follow these steps:</p>
      <ol className="list-decimal pl-5 mt-2">
        <li>Ensure your microphone is connected and working properly.</li>
        <li>Allow microphone access when prompted by your browser.</li>
        <li>Select your preferred language from the language settings.</li>
        <li>Speak clearly and wait for a confirmation tone.</li>
      </ol>
      <p className="mt-2">You can use commands like "play," "sleep," and "eat."</p>
    </div>
  );
};

export default SetupGuide;
