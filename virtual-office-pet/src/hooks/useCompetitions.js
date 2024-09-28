import { useState } from 'react';

export const useCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);

  const joinCompetition = (competition) => {
    setCompetitions([...competitions, competition]);
    // Additional logic for competition entry fees can be added here
  };

  return { competitions, joinCompetition };
};
