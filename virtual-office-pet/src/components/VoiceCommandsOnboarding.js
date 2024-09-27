import React from 'react';

const VoiceCommandsOnboarding = () => {
  return (
    <div className="voice-commands-onboarding p-4 bg-gray-100 rounded shadow mt-8">
      <h2 className="text-lg font-bold">Voice Commands Onboarding</h2>
      <p className="mt-2">Follow these steps to get started with voice commands:</p>
      <ol className="list-decimal list-inside mt-4">
        <li>Ensure your microphone is working and permissions are granted.</li>
        <li>Click 'Start Voice Recognition' to begin issuing commands.</li>
        <li>Try different commands like "play", "sit", or "sleep".</li>
        <li>Explore commands in various languages such as French, German, or Spanish.</li>
        <li>Click 'Stop Voice Recognition' to end voice interaction.</li>
      </ol>
    </div>
  );
};

export default VoiceCommandsOnboarding;
