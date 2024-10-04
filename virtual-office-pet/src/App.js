import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import ColorSchemeSelector from './components/ui/ColorSchemeSelector';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css';

const petTypes = [
  { name: 'Dog', icon: Dog },
  { name: 'Cat', icon: Cat },
];

const PetAction = ({ icon: Icon, label, onClick }) => (
  <Button onClick={onClick} className="flex items-center space-x-2">
    {Icon ? <Icon size={20} /> : <span>Icon Missing</span>}
    <span>{label}</span>
  </Button>
);

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, updateMoodScore] = useState(50);
  const [lastAction, setLastAction] = useState(null);
  const [themeColor, setThemeColor] = useState('default-theme');

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    updateMoodScore(70);
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    updateMoodScore((prevScore) => Math.min(prevScore + 10, 100));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateMoodScore((prevScore) => Math.max(prevScore - 5, 0));
    }, 5000);

    return () => clearInterval(timer);
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

  return (
    <div className={`App ${themeColor}`}>
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
                  <Button key={type.name} onClick={() => adoptPet(type)} className="flex flex-col items-center justify-center">
                    {<type.icon size={40} />}
                    <span>{type.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-4">
                {<pet.icon size={80} />}
                <p>Mood: {mood}</p>
                {lastAction && <p>Last action: {lastAction}</p>}
              </div>
              <div className="button-container grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
                <PetAction icon={Play} label="Play" onClick={() => performAction('Played')} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ColorSchemeSelector onChangeTheme={(color) => setThemeColor(color)} />
    </div>
  );
};

export default VirtualOfficePet;
