import React from 'react';

const HelpSection = () => {
  return (
    <div className="help-section p-4 bg-gray-100 rounded shadow mt-8">
      <h2 className="text-lg font-bold">Help Section</h2>
      <p className="mt-2">Having trouble with voice commands? Here are some tips:</p>
      <ul className="list-disc list-inside mt-4">
        <li>Ensure your microphone permissions are granted in your browser settings.</li>
        <li>Check if your browser supports speech recognition features.</li>
        <li>Speak clearly and slowly for better recognition accuracy.</li>
        <li>Use the provided buttons as an alternative if recognition fails.</li>
      </ul>
    </div>
  );
};

export default HelpSection;
