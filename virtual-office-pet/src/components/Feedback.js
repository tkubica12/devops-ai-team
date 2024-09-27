import React from 'react';
import { gsap } from 'gsap';

const Feedback = ({ message, onClose }) => {
  React.useEffect(() => {
    gsap.fromTo("#feedback", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 });
  }, []);

  return (
    <div id="feedback" className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg">
      <p>{message}</p>
      <button onClick={onClose} className="mt-2 bg-blue-700 px-2 py-1 rounded">Close</button>
    </div>
  );
};

export default Feedback;
