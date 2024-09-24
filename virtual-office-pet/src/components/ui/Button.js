import React from 'react';

// Button component used for interactive elements like pet actions
// Uses semantic and descriptive class names to enhance readability
// bg-primary: Sets the primary background color
// hover:bg-primary-dark: Darkens the button on hover
// text-white: Ensures the text color is white for visibility
// font-bold: Uses bold font for emphasis
// py-2 px-4: Provides padding for the button
// rounded: Adds rounded corners to the button
export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded ${className}`}
  >
    {children}
  </button>
);