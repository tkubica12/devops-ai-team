import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import PetAction from './components/PetAction';
import PetSelect from './components/ui/PetSelect';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import './App.css';

const petTypes = [
  { name: 'Dog', icon: Dog, description: 'A loyal dog.' },
  { name: 'Cat', icon: Cat, description: 'A curious cat.' },
];

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, setMoodScore] = useState(50);
  const [lastAction, setLastAction] = useState(null);
  const { speak } = useSpeechSynthesis();

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setMoodScore(70);
    setLastAction('Adopted');
    speak({ text: `You have adopted a ${petType.name}. ${petType.description}` });
  };

  const performAction = (action) => {
    setLastAction(action);
    setMoodScore((prevScore) => Math.min(prevScore + 10, 100));
    speak({ text: `You have ${action.toLowerCase()} your pet.` });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setMoodScore((prevScore) => Math.max(prevScore - 5, 0));
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
    <div className="App">
      <Card className="w-80 mx-auto mt-8">
        <CardHeader>
          <CardTitle>Virtual Office Pet</CardTitle>
        </CardHeader>
        <CardContent>
          {!pet ? (
            <PetSelect petTypes={petTypes} adoptPet={adoptPet} />
          ) : (
            <div>
              <div className="text-center mb-4">
                <pet.icon size={80} alt={`Your pet is ${mood}`} />
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
    </div>
  );
};

export default VirtualOfficePet;
