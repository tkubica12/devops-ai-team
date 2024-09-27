import React, { useState } from 'react';
import Button from '@mui/material/Button';

const Competitions = () => {
  const [registered, setRegistered] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Alice', score: 150 },
    { name: 'Bob', score: 120 },
    { name: 'Charlie', score: 100 },
  ]);

  const register = () => setRegistered(true);
  const renderLeaderboard = () =>
    leaderboard.map((entry, index) => (
      <div key={index} className="flex justify-between p-2 border-b">
        <span>{entry.name}</span>
        <span>{entry.score}</span>
      </div>
    ));

  return (
    <div className="competitions mt-8">
      <h3 className="text-lg font-bold">Virtual Competitions</h3>
      {registered ? (
        <div>
          <h4 className="font-semibold mt-4">Leaderboard</h4>
          <div className="mt-2">{renderLeaderboard()}</div>
        </div>
      ) : (
        <Button variant="contained" color="primary" onClick={register} className="mt-4">
          Register for Competitions
        </Button>
      )}
    </div>
  );
};

export default Competitions;
