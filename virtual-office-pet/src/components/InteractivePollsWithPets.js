import React, { useState } from 'react';
import { Button } from './ui/Button';

const InteractivePollsWithPets = () => {
  const [vote, setVote] = useState(null);
  const [results, setResults] = useState({ option1: 0, option2: 0 });

  const castVote = (option) => {
    setVote(option);
    setResults((prevResults) => ({
      ...prevResults,
      [option]: prevResults[option] + 1,
    }));
  };

  return (
    <div className="interactive-polls mt-8">
      <h3 className="text-lg font-bold">Interactive Polls with Pets</h3>
      <p>Which pet activity should we add next?</p>
      <Button onClick={() => castVote('option1')} disabled={vote !== null}>Play Fetch</Button>
      <Button onClick={() => castVote('option2')} disabled={vote !== null}>Pet Training</Button>
      {vote && <p className="mt-4">You voted for: {vote === 'option1' ? 'Play Fetch' : 'Pet Training'}</p>}
      <div className="mt-4">
        <p>Results:</p>
        <p>Play Fetch: {results.option1} votes</p>
        <p>Pet Training: {results.option2} votes</p>
      </div>
    </div>
  );
};

export default InteractivePollsWithPets;
