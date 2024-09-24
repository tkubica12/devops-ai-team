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
    // Removed unnecessary interval
  }, []);

  const startListening = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        if (command.includes('happy')) {
          setMood('happy');
          setLastAction('Heard: Be Happy');
        } else if (command.includes('sit')) {
          setMood('calm');
          setLastAction('Heard: Sit');
        }
      };

      recognition.start();
    } else {
      console.error('Speech Recognition API is not supported in this browser.');
    }
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
              <pet.icon size={80} />
              <p>Mood: {mood}</p>
              {lastAction && <p>Last action: {lastAction}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
              <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
              <Button onClick={startListening} className="col-span-2">Start Listening</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualOfficePet;