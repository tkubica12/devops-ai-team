import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DesignTool = ({ onSave }) => {
  const [design, setDesign] = useState('');

  const handleSave = () => {
    onSave(design);
    alert('Design saved successfully!');
  };

  return (
    <div>
      <textarea value={design} onChange={(e) => setDesign(e.target.value)} />
      <button onClick={handleSave}>Save Design</button>
    </div>
  );
};

DesignTool.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default DesignTool;
