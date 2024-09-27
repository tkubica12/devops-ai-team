import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css';
import ThemeToggle from './components/ThemeToggle';

const petTypes = [
  { id: 1, name: 'Dog', icon: Dog },
  { id: 2, name: 'Cat', icon: Cat },
];

const PetAction = ({ icon: Icon, label, onClick }) => (
  <Button onClick={onClick} className="flex items-center space-x-2">
    <Icon size={20} />
    <span>{label}</span>
  </Button>
);

PetAction.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, setMoodScore] = useState(50);
  const [lastAction, setLastAction] = useState(null);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setMoodScore(70);
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    setMoodScore((prevScore) => Math.min(prevScore + 10, 100));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        setMoodScore((prevScore) => Math.max(prevScore - 5, 0));
      } catch (error) {
        console.error("Error in timer:", error);
        // Fallback logic
        setMoodScore(50); // Resetting to neutral state
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      if (moodScore >= 70) {
        setMood('happy');
      } else if (moodScore >= 40) {
        setMood('okay');
      } else {
        setMood('sad');
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [moodScore]);

  return (
    <div className="App">
      <Card className="w-80 mx-auto mt-8">
        <CardHeader>
          <CardTitle>Virtual Office Pet</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
          <div className="my-4">
            {!pet ? (
              <div>
                <p>Choose your pet:</p>
                <div className="button-container mt-4">
                  {petTypes.map((type) => (
                    <Button key={type.id} onClick={() => adoptPet(type)} className="flex flex-col items-center">
                      <type.icon size={40} />
                      <span>{type.name}</span>
                    </Button>
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
                  <PetAction key={Coffee.name} icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                  <PetAction key={MessageSquare.name} icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
                  <PetAction key={Play.name} icon={Play} label="Play" onClick={() => performAction('Played')} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

VirtualOfficePet.propTypes = {
  theme: PropTypes.string
};

export default VirtualOfficePet;
