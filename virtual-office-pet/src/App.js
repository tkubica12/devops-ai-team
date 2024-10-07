import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css';
import VirtualPetLifecycle from './components/VirtualPetLifecycle'; // Import lifecycle component
import Notification from './components/Notification'; // Import notification component

const petTypes = [
  { name: 'Dog', icon: Dog },
  { name: 'Cat', icon: Cat },
];

const PetAction = ({ icon: Icon, label, onClick }) => (
  <Button onClick={onClick} className="flex items-center space-x-2">
    <Icon size={20} />
    <span>{label}</span>
  </Button>
);

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, setMoodScore] = useState(50);
  const [lastAction, setLastAction] = useState(null);
  const [notification, setNotification] = useState('');

  const adoptPet = (petType) => {
    setPet({ type: petType, moodScore: 70 });
    setMood('excited');
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    setMoodScore((prevScore) => Math.min(prevScore + 10, 100));
  };

  useEffect(() => {
    let isMounted = true;

    const updateMood = () => {
      setMoodScore((prevScore) => Math.max(prevScore - 5, 0));
    };

    const timer = setInterval(() => {
      if (isMounted) updateMood();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
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

  const handlePetDie = () => {
    setPet(null);
    setNotification('Your pet has passed away.');
  };

  return (
    <div className="App">
      {notification && <Notification message={notification} />}
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
                <pet.type.icon size={80} />
                <p>Mood: {mood}</p>
                {lastAction && <p>Last action: {lastAction}</p>}
              </div>
              <div className="button-container grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
                <PetAction icon={Play} label="Play" onClick={() => performAction('Played')} />
              </div>
              <VirtualPetLifecycle pet={pet} onPetDie={handlePetDie} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualOfficePet;
