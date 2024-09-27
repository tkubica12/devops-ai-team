import React from 'react';
import PropTypes from 'prop-types';

const VotingSystem = ({ leaderboard, handleVote }) => {
  return (
    <div className="voting-system mt-8">
      <h4 className="font-semibold">Voting System</h4>
      {leaderboard.map((entry, index) => (
        <div key={`vote-${index}`} className="flex justify-between items-center p-2 border-b">
          <span>{entry.name}</span>
          <button onClick={() => handleVote(entry.name)} className="bg-green-500 text-white p-1 rounded">
            Vote
          </button>
        </div>
      ))}
    </div>
  );
};

VotingSystem.propTypes = {
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleVote: PropTypes.func.isRequired
};

export default VotingSystem;
