import React from 'react';
import Slider from '@mui/material/Slider';

const Settings = () => {
  const handleTextSizeChange = (event, newValue) => {
    document.documentElement.style.setProperty('--text-size', `${newValue}px`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Settings</h2>
      <div>
        <label htmlFor="text-size-slider" className="block mb-2">Text Size</label>
        <Slider
          defaultValue={16}
          aria-labelledby="text-size-slider"
          step={2}
          marks
          min={12}
          max={24}
          valueLabelDisplay="auto"
          onChange={handleTextSizeChange}
        />
      </div>
    </div>
  );
};

export default Settings;
