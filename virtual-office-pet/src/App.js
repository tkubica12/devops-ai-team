import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import { SpeechProvider, useSpeechContext } from '@speechly/react-client';
import { PushToTalkButton, PushToTalkButtonContainer } from '@speechly/react-ui';
import validator from 'validator';
import DOMPurify from 'dompurify';
import './App.css'; 

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
  const { segment } = useSpeechContext();
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, setMoodScore] = useState(50);
  const [lastAction, setLastAction] = useState(null);

  const sanitizeTranscript = (transcript) => {
    const sanitized = DOMPurify.sanitize(validator.escape(transcript));
    return ['play', 'sleep'].includes(sanitized) ? sanitized : null;
  };

  useEffect(() => {
    if (segment && segment.isFinal) {
      const command = sanitizeTranscript(segment.intent.intent);
      if (command) performAction(command.charAt(0).toUpperCase() + command.slice(1));
      console.log('Recognized command:', segment.intent.intent);
    }
  }, [segment]);

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
    <SpeechProvider appId="your-app-id">
      <div className="App">
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
              </div>
            )}
          </CardContent>
        </Card>
        {segment && segment.words.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Heard: {segment.words.map((w) => w.value).join(' ')}</p>
          </div>
        )}
        <PushToTalkButtonContainer>
          <PushToTalkButton captureKey=" " />
        </PushToTalkButtonContainer>
      </div>
    </SpeechProvider>
  );
};

export default VirtualOfficePet;
