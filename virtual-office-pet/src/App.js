import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css'; // Import the CSS file
import InAppPurchase from './components/InAppPurchase';

const petTypes = [
  { name: 'Dog', icon: Dog },
  { name: 'Cat', icon: Cat },
];

const MOODS = {
  HAPPY: 'happy',
  EXCITED: 'excited',
  OKAY: 'okay',
  SAD: 'sad'
};

const ACTIONS = {
  ADOPT: 'Adopted',
  FEED: 'Fed',
  TALK: 'Talked',
  PLAY: 'Played'
};

const PetAction = ({ icon: Icon, label, onClick }) => (
  <Button onClick={onClick} className="flex items-center space-x-2">
    <Icon size={20} />
    <span>{label}</span>
  </Button>
);

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState(MOODS.HAPPY);
  const [moodScore, setMoodScore] = useState(50); // Initial mood score
  const [lastAction, setLastAction] = useState(null);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood(MOODS.EXCITED);
    setMoodScore(70); // Set initial mood score when pet is adopted
    setLastAction(ACTIONS.ADOPT);
  };

  const updateMoodScore = (change) => {
    setMoodScore((prevScore) =>
      Math.min(Math.max(prevScore + change, 0), 100) // Ensure score stays between 0 and 100
    );
  };

  const performAction = (action) => {
    setLastAction(action);
    updateMoodScore(10); // Increase mood score, max 100
  };

  const handlePurchase = (option) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`Purchased: ${option.name} for ${option.price}`);
    }
    // Handle purchase logic here
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateMoodScore(-5); // Decrease mood score every 5 seconds
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update mood based on mood score
    if (moodScore >= 70) {
      setMood(MOODS.HAPPY);
    } else if (moodScore >= 40) {
      setMood(MOODS.OKAY);
    } else {
      setMood(MOODS.SAD);
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
                  <Button key={type.name} onClick={() => adoptPet(type)} className="flex flex-col items-center">
                    <type.icon size={40} />
                    <span>{type.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                {React.createElement(pet.icon, {size: 80})} {/* Corrected icon rendering */}
                <p>Mood: {mood}</p>
                {lastAction && <p>Last action: {lastAction}</p>}
              </div>
              <div className="button-container grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction(ACTIONS.FEED)} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction(ACTIONS.TALK)} />
                <PetAction icon={Play} label="Play" onClick={() => performAction(ACTIONS.PLAY)} /> {/* New Play action */}
              </div>
              <InAppPurchase onPurchase={handlePurchase} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualOfficePet;
