import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare } from 'lucide-react';
import './styles/darkMode.css';

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
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    // Logic to change the pet's mood based on the action
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Periodically update pet's mood or trigger random events
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      <Button onClick={toggleDarkMode} className="toggle-dark-mode">
        Toggle Dark Mode
      </Button>
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
                <pet.icon size={80} />
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
    </div>
  );
};

export default VirtualOfficePet;
