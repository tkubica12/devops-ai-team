import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Sun, Moon } from 'lucide-react';
import styled from '@emotion/styled';

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

const Container = styled.div`
  ${(props) => (props.darkMode ? 'background-color: #333; color: #fff;' : '')}
`;

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [lastAction, setLastAction] = useState(null);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    setMood('content'); // Simple mood logic
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setMood((prevMood) => (prevMood === 'happy' ? 'playful' : 'happy'));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container darkMode={darkMode} className="h-full flex justify-center items-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Virtual Office Pet</CardTitle>
          <Button onClick={toggleDarkMode} className="ml-auto">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
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
    </Container>
  );
};

export default VirtualOfficePet;