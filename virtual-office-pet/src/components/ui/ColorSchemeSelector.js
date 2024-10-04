import React, { useState } from 'react';

const themes = [
  { name: 'Default', color: 'default-theme' },
  { name: 'Green Mint', color: 'green-mint-theme' },
  { name: 'Forest', color: 'forest-theme' },
  { name: 'Emerald', color: 'emerald-theme' },
];

const ColorSchemeSelector = ({ onChangeTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState('Default');

  const handleChange = (theme) => {
    setSelectedTheme(theme.name);
    onChangeTheme(theme.color);
  };

  return (
    <div className="text-center mt-4">
      <p>Select color scheme:</p>
      <div className="button-container mt-2">
        {themes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => handleChange(theme)}
            className={`${selectedTheme === theme.name ? 'bg-green-500' : 'bg-gray-200'} hover:bg-gray-300 text-black font-bold py-2 px-4 rounded`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;
