import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css';
import VoiceCommands from './components/VoiceCommands';

const sanitizeInput = (input) => {
  const element = document.createElement('div');
  element.innerText = input;
  return element.innerHTML;
};

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
  const [state, setState] = useState({ pet: null, mood: 'happy', moodScore: 50, lastAction: null });

  const adoptPet = (petType) => {
    setState({ ...state, pet: petType, mood: 'excited', moodScore: 70, lastAction: 'Adopted' });
  };

  const performAction = (action) => {
    setState((prevState) => ({
      ...prevState,
      lastAction: sanitizeInput(action),
      moodScore: Math.min(prevState.moodScore + 10, 100),
    }));
  };

  const handleVoiceCommand = (command) => {
    const sanitizedCommand = sanitizeInput(command);
    if (['play', 'sleep'].includes(sanitizedCommand)) {
      performAction(sanitizedCommand.charAt(0).toUpperCase() + sanitizedCommand.slice(1) + ' Commanded');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prevState) => ({ ...prevState, moodScore: Math.max(prevState.moodScore - 5, 0) }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mood = state.moodScore >= 70 ? 'happy' : state.moodScore >= 40 ? 'okay' : 'sad';
    setState((prevState) => ({ ...prevState, mood }));
  }, [state.moodScore]);

  return (
    <div className="App">
      <Card className="w-80 mx-auto mt-8">
        <CardHeader>
          <CardTitle>Virtual Office Pet</CardTitle>
        </CardHeader>
        <CardContent>
          {!state.pet ? (
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
                <state.pet.icon size={80} />
                <p>Mood: {state.mood}</p>
                {state.lastAction && <p>Last action: {state.lastAction}</p>}
              </div>
              <div className="button-container grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
                <PetAction icon={Play} label="Play" onClick={() => performAction('Played')} />
              </div>
              <VoiceCommands onCommand={handleVoiceCommand} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualOfficePet;
