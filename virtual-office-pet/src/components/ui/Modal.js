import React from 'react';

export const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm w-full">
      {children}
    </div>
  </div>
);

export const ModalHeader = ({ children }) => (
  <div className="border-b pb-2 mb-2">
    <h3 className="text-lg font-semibold">{children}</h3>
  </div>
);

export const ModalContent = ({ children }) => (
  <div>{children}</div>
);