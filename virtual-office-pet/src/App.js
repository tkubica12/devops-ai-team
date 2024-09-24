import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare } from 'lucide-react';

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
  const [lastAction, setLastAction] = useState(null);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    // Here you would implement logic to change the pet's mood based on the action
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Periodically update pet's mood or trigger random events
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const renderPetIcon = () => {
    if (pet.name === 'Dog') return <Dog size={80} />;
    if (pet.name === 'Cat') return <Cat size={80} />;
    return null;
  };

  return (
    <Card className="w-80 mx-auto mt-8">
      <CardHeader>
        <CardTitle>Virtual Office Pet</CardTitle>
      </CardHeader>
      <CardContent>
        {!pet ? (
          <div>
            <p>Choose your pet:</p>
            <div className="flex justify-around mt-4">
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
              {renderPetIcon()}
              <p>Mood: {mood}</p>
              {lastAction && <p>Last action: {lastAction}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
              <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
              {/* Add more actions as needed */}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualOfficePet;