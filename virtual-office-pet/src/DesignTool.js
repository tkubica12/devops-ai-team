import React, { useState } from 'react';
import { Modal, ModalHeader, ModalContent } from './components/ui/Modal';

const DesignTool = () => {
  const [showModal, setShowModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleAction = () => {
    setFeedbackMessage('Action successful!');
    setShowModal(true);
  };

  return (
    <div>
      <button onClick={handleAction} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Perform Action
      </button>

      {showModal && (
        <Modal>
          <ModalHeader>Feedback</ModalHeader>
          <ModalContent>{feedbackMessage}</ModalContent>
          <button onClick={() => setShowModal(false)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default DesignTool;