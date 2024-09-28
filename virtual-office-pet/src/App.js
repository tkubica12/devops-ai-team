import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play } from 'lucide-react';
import './App.css';
import VoiceRecognition from './voiceRecognition';
import DOMPurify from 'dompurify';
import Modal from './components/ui/Modal';

const petTypes = [
  { name: 'Dog', icon: Dog },
  { name: 'Cat', icon: Cat },
];

const sanitizeInput = (input) => DOMPurify.sanitize(input);

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
  const [showModal, setShowModal] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);

  const confirmAction = (command) => {
    setPendingCommand(command);
    setShowModal(true);
  };

  const executePendingCommand = () => {
    performAction(pendingCommand);
    setPendingCommand(null);
    setShowModal(false);
  };

  useEffect(() => {
    VoiceRecognition.start((command) => {
      const sanitizedCommand = sanitizeInput(command);
      if (sanitizedCommand === 'feed') confirmAction('Fed');
      else if (sanitizedCommand === 'talk') confirmAction('Talked');
      else if (sanitizedCommand === 'play') confirmAction('Played');
    });
  }, []);

  const adoptPet = (petType) => {
    const sanitizedPetType = sanitizeInput(petType.name);
    setPet(petType);
    setMood('excited');
    setMoodScore(70);
    setLastAction(`Adopted ${sanitizedPetType}`);
  };

  const performAction = (action) => {
    setLastAction(sanitizeInput(action));
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
                <PetAction icon={Coffee} label="Feed" onClick={() => confirmAction('Fed')} />
                <PetAction icon={MessageSquare} label="Talk" onClick={() => confirmAction('Talked')} />
                <PetAction icon={Play} label="Play" onClick={() => confirmAction('Played')} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <p>Are you sure you want to perform the action: {pendingCommand}?</p>
        <Button onClick={executePendingCommand}>Confirm</Button>
        <Button onClick={() => setShowModal(false)}>Cancel</Button>
      </Modal>
    </div>
  );
};

export default VirtualOfficePet;
