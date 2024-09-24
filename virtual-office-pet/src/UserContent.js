import React from 'react';
import { useState, useEffect } from 'react';

const UserContent = ({ userId }) => {
  const [userDesigns, setUserDesigns] = useState([]);

  useEffect(() => {
    // Simulate database fetch
    const fetchUserDesigns = async () => {
      const response = await fetch(`/api/userDesigns?userId=${userId}`);
      const data = await response.json();
      setUserDesigns(data);
    };

    fetchUserDesigns();
  }, [userId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Your Designs</h3>
      <ul>
        {userDesigns.map((design, index) => (
          <li key={index} className="border rounded p-2 mb-2">
            {design}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserContent;