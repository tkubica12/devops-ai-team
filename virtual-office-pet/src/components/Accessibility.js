export const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

export const setTextToSpeech = () => {
  const quotesButton = document.querySelector('button[alt="Quotes"]');
  if (quotesButton) {
    quotesButton.addEventListener('click', () => {
      speak('Here is your motivational quote: believe in yourself!');
    });
  }
};

export const applyAccessibilityFeatures = () => {
  document.body.style.colorScheme = 'light dark';
  speak('Accessibility features are enabled');
};
