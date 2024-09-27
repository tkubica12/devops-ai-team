import React from 'react';
import PropTypes from 'prop-types';

const LanguageSelector = ({ setLanguage }) => {
  const languages = [
    { code: 'en-US', label: 'English' },
    { code: 'fr-FR', label: 'French' },
    { code: 'es-ES', label: 'Spanish' },
    { code: 'de-DE', label: 'German' },
  ];

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="language-selector mt-4">
      <label htmlFor="language" className="mr-2">Choose Language:</label>
      <select id="language" onChange={handleLanguageChange} className="p-2 border rounded">
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
};

LanguageSelector.propTypes = {
  setLanguage: PropTypes.func.isRequired
};

export default LanguageSelector;
