import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee } from 'lucide-react';
import styled, { ThemeProvider } from 'styled-components';

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

const darkTheme = {
  background: '#333',
  color: '#fff'
};

const lightTheme = {
  background: '#fff',
  color: '#000'
};

const ThemeButton = styled(Button)`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
`;

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [lastAction, setLastAction] = useState(null);
  const [theme, setTheme] = useState(lightTheme);

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    if (action === 'Fed') {
      setMood('satisfied');
    } else if (action === 'Talked') {
      setMood('social');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Periodically update pet's mood or trigger random events
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeProvider theme={theme}>
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
              <div className="grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                <PetAction icon={Coffee} label="Talk" onClick={() => performAction('Talked')} />
                {/* Add more actions as needed */}
              </div>
              <ThemeButton onClick={toggleTheme}>Toggle Theme</ThemeButton>
            </div>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default VirtualOfficePet;
