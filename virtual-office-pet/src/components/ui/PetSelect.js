import React from 'react';
import { Button } from './Button';

const PetSelect = ({ petTypes, adoptPet }) => (
  <div>
    <p>Choose your pet:</p>
    <div className="button-container mt-4">
      {petTypes.map((type) => (
        <Button key={type.name} onClick={() => adoptPet(type)} aria-label={`Adopt ${type.name}`} className="flex flex-col items-center">
          <type.icon size={40} alt={type.description} />
          <span>{type.name}</span>
        </Button>
      ))}
    </div>
  </div>
);

export default PetSelect;
