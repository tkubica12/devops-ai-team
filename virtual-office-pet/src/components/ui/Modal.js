import React from 'react';

export const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-11/12 md:w-1/2">
        <div className="p-4">
          {children}
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
