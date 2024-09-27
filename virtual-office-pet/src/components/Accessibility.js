export const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

export const setTextToSpeech = () => {
  const quotesButton = document.querySelector('button[aria-label="Quotes"]');
  if (quotesButton) {
    quotesButton.addEventListener('click', () => {
      speak('Here is your motivational quote: believe in yourself!');
    });
  }
};

export const applyAccessibilityFeatures = () => {
  // Ensure sufficient color contrast
  document.documentElement.style.setProperty('--text-color', '#ffffff');
  document.documentElement.style.setProperty('--header-bg-color', '#282c34');

  speak('Accessibility features are enabled');

  // Adjust text sizes
  let textSize = localStorage.getItem('textSize') || 'medium';
  document.documentElement.style.setProperty('--text-size', textSize);

  setTextToSpeech();
};
