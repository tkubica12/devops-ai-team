import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Dog, Cat, Coffee, MessageSquare, Play, Moon, Sun } from 'lucide-react';
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

PetAction.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const VirtualOfficePet = () => {
  const [pet, setPet] = useState(null);
  const [mood, setMood] = useState('happy');
  const [moodScore, setMoodScore] = useState(50);
  const [lastAction, setLastAction] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

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

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    try {
      const timer = setInterval(() => {
        setMoodScore((prevScore) => Math.max(prevScore - 5, 0));
      }, 5000);
      return () => clearInterval(timer);
    } catch (error) {
      console.error('Error in timer:', error);
      // Integrate here with an error tracking system like Sentry
    }
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
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} Toggle Dark Mode
          </button>
          <div className="my-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualOfficePet;
