import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare } from 'lucide-react';
import { THEME_MODES, useThemeStyles, validateAction, getIconForPetType } from './utils/helpers';

const petTypes = {
  Dog: Dog,
  Cat: Cat,
};

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
  const { themeClass } = useThemeStyles();

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    try {
      validateAction(action);
      setLastAction(action);
      // Here you would implement logic to change the pet's mood based on the action
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Periodically update pet's mood or trigger random events
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className={`w-80 mx-auto mt-8 ${themeClass}`}>
      <CardHeader>
        <CardTitle>Virtual Office Pet</CardTitle>
      </CardHeader>
      <CardContent>
        {!pet ? (
          <div>
            <p>Choose your pet:</p>
            <div className="flex justify-around mt-4">
              {Object.keys(petTypes).map((type) => (
                <Button key={type} onClick={() => adoptPet({ name: type, icon: petTypes[type] })} className="flex flex-col items-center">
                  {React.createElement(getIconForPetType(type))}
                  <span>{type}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              {React.createElement(pet.icon, { size: 80 })}
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
