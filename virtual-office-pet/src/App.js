import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css'; // Import the CSS file

const INITIAL_MOOD_SCORE = 50;
const MOOD_SCORE_INCREMENT = 10;
const MOOD_SCORE_DECREMENT = 5;
const MOOD_UPDATE_INTERVAL = 5000;
const MAX_MOOD_SCORE = 100;
const MIN_MOOD_SCORE = 0;

const petTypes = [
  { name: 'Dog', icon: Dog },
  { name: 'Cat', icon: Cat },
];

const PetAction = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="button-local">
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, setMoodScore] = useState(INITIAL_MOOD_SCORE);
  const [lastAction, setLastAction] = useState(null);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setMoodScore(70);
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    setMoodScore((prevScore) => Math.min(prevScore + MOOD_SCORE_INCREMENT, MAX_MOOD_SCORE));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setMoodScore((prevScore) => Math.max(prevScore - MOOD_SCORE_DECREMENT, MIN_MOOD_SCORE));
    }, MOOD_UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (moodScore >= 70) {
      setMood('happy');
    } else if (moodScore >= 40) {
      setMood('okay');
    } else {
      setMood('sad');
    }
  }, [moodScore]);

  return (
    <div className="App">
      <Card className="w-80 mx-auto mt-8">
        <CardHeader>
          <CardTitle>Virtual Office Pet</CardTitle>
        </CardHeader>
        <CardContent>
          {!pet ? (
            <div>
              <p>Choose your pet:</p>
              <div className="button-container mt-4">
                {petTypes.map((type) => (
                  <button key={type.name} onClick={() => adoptPet(type)} className="button-local flex flex-col items-center">
                    <type.icon size={40} />
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                <pet.icon size={80} />
                <p>Mood: {mood}</p>
                {lastAction && <p>Last action: {lastAction}</p>}
              </div>
              <div className="button-container grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
                <PetAction icon={Play} label="Play" onClick={() => performAction('Played')} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualOfficePet;
