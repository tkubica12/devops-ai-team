import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from './ui/Button';

const Competitions = () => {
  const [registered, setRegistered] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Alice', score: 150 },
    { name: 'Bob', score: 120 },
    { name: 'Charlie', score: 100 },
  ]);
  const [participants, setParticipants] = useState(['Sam', 'Jill', 'Tom']);

  const register = () => {
    setRegistered(true);
    toast.info('You have registered for the competition!');
  };

  const renderLeaderboard = () =>
    leaderboard.map((entry, index) => (
      <div key={`leaderboard-${index}`} className="flex justify-between p-2 border-b">
        <span>{entry.name}</span>
        <span>{entry.score}</span>
      </div>
    ));

  const renderParticipants = () =>
    participants.map((name, index) => (
      <div key={`participant-${index}`} className="flex justify-between p-2 border-b">
        <span>{name}</span>
      </div>
    ));

  return (
    <div className="competitions mt-8">
      <h3 className="text-lg font-bold">Virtual Competitions</h3>
      {registered ? (
        <div>
          <h4 className="font-semibold mt-4">Leaderboard</h4>
          <div className="mt-2">{renderLeaderboard()}</div>
          <h4 className="font-semibold mt-4">Participants</h4>
          <div className="mt-2">{renderParticipants()}</div>
        </div>
      ) : (
        <Button onClick={register} className="mt-4">
          Register for Competitions
        </Button>
      )}
    </div>
  );
};

Competitions.propTypes = {
  registered: PropTypes.bool,
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired
    })
  ),
  participants: PropTypes.arrayOf(PropTypes.string)
};

export default Competitions;