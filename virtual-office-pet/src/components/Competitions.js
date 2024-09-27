import React from 'react';

const Competitions = () => {
  // Placeholder components for competitions
  const competitions = [
    { name: 'Best Dressed', description: 'Show off your best outfit!' },
    // add more competitions
  ];

  return (
    <div>
      <h2>Competitions</h2>
      <ul>
        {competitions.map((comp) => (
          <li key={comp.name}>
            <h3>{comp.name}</h3>
            <p>{comp.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Competitions;
