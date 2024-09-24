import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Wardrobe = ({ userId }) => {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      const response = await fetch(`/api/user/${userId}/outfits`);
      const data = await response.json();
      setOutfits(data);
    };

    fetchOutfits();
  }, [userId]);

  return (
    <div>
      <h2>Wardrobe</h2>
      <ul>
        {outfits.map((outfit) => (
          <li key={outfit.id}>{outfit.name}</li>
        ))}
      </ul>
    </div>
  );
};

Wardrobe.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Wardrobe;
