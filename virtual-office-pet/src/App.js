import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare } from 'lucide-react';
import styles from './App.module.css';

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
  };

  useEffect(() => {
    return () => clearInterval();
  }, []);

  return (
    <Card className="w-80 mx-auto mt-8">
      <CardHeader>
        <CardTitle>Virtual Office Pet</CardTitle>
      </CardHeader>
      <CardContent>
        {!pet ? (
          <div>
            <p>Choose your pet:</p>
            <div className={styles.petChoiceContainer}>
              {petTypes.map(({ name, icon: Icon }) => (
                <Button key={name} onClick={() => adoptPet({ name, icon: Icon })} className={styles.petButton}>
                  <Icon size={40} />
                  <span>{name}</span>
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualOfficePet;
