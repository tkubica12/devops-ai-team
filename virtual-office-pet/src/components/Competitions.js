import React, { useState } from 'react';

const mockCompetitions = [
  { name: 'Cutest Pet Contest', fee: 2 },
  { name: 'Best Dressed Pet', fee: 3 },
];

export const Competitions = ({ onJoin }) => {
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  return (
    <div className="competitions-container">
      <h2>Pet Competitions</h2>
      <ul>
        {mockCompetitions.map(comp => (
          <li key={comp.name} className="competition">
            <span>{comp.name} - ${comp.fee}</span>
            <button onClick={() => setSelectedCompetition(comp)}>Join</button>
          </li>
        ))}
      </ul>
      {selectedCompetition && (
        <div>
          <h3>Joining: {selectedCompetition.name}</h3>
          <button onClick={() => onJoin(selectedCompetition)}>Confirm Entry</button>
        </div>
      )}
    </div>
  );
};
