import React from 'react';

const OnboardingTutorial = () => {
  return (
    <div className="onboarding-tutorial p-4 bg-gray-100 rounded shadow mt-8">
      <h2 className="text-lg font-bold">Voice Commands Tutorial</h2>
      <p className="mt-2">Welcome to the voice commands tutorial. Follow the steps below to start using voice commands:</p>
      <ol className="list-decimal list-inside mt-4">
        <li>Ensure your microphone is enabled and your browser supports speech recognition.</li>
        <li>Click the "Start Voice Recognition" button to begin listening.</li>
        <li>Try saying commands like "play" or "sleep" to interact with your virtual pet.</li>
        <li>Click the "Stop Voice Recognition" button to end the session.</li>
        <li>Now supporting multiple languages! Try commands in different languages like "jouer" (French) or "dormir" (Spanish).</li>
      </ol>
    </div>
  );
};

export default OnboardingTutorial;
