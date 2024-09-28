import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import DOMPurify from 'dompurify';
import { voiceCommands } from './hooks/voiceCommands';
import { Feedback } from './components/Feedback';
import { SeasonalOutfits } from './components/SeasonalOutfits';
import { Competitions } from './components/Competitions';
import { useSeasonalOutfits } from './hooks/useSeasonalOutfits';
import { useCompetitions } from './hooks/useCompetitions';

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
  const [language, setLanguage] = useState('en');

  const { listen, listening, stop, voiceCommand, error } = useSpeechRecognition();
  const { ownedOutfits, purchaseOutfitPack } = useSeasonalOutfits();
  const { competitions, joinCompetition } = useCompetitions();

  useEffect(() => {
    if (voiceCommand) {
      handleVoiceCommand(voiceCommand);
    }
  }, [voiceCommand]);

  const handleVoiceCommand = (command) => {
    const sanitizedCommand = DOMPurify.sanitize(command);
    if (voiceCommands[language][sanitizedCommand]) {
      performAction(voiceCommands[language][sanitizedCommand]);
    }
  };

  const adoptPet = (petType) => {
    setPet(petType);
    setMood('excited');
    setMoodScore(70);
    setLastAction('Adopted');
  };

  const performAction = (action) => {
    setLastAction(action);
    setMoodScore((prevScore) => Math.min(prevScore + 10, 100));
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
          {error && <Feedback type="error" message={error} />}
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
                <pet.icon size={80} />
                <p>Mood: {mood}</p>
                {lastAction && <p>Last action: {lastAction}</p>}
              </div>
              <div className="button-container grid grid-cols-2 gap-2">
                <PetAction icon={Coffee} label="Feed" onClick={() => performAction('Fed')} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => performAction('Talked')} />
                <PetAction icon={Play} label="Play" onClick={() => performAction('Played')} />
              </div>
              <Button onClick={!listening ? listen : stop} className="mt-4">
                {!listening ? 'Start Listening' : 'Stop Listening'}
              </Button>
              {voiceCommand && (
                <p className="mt-2">Command recognized: {voiceCommand}</p>
              )}
            </div>
          )}
          <SeasonalOutfits onPurchase={purchaseOutfitPack} />
          <Competitions onJoin={joinCompetition} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualOfficePet;
