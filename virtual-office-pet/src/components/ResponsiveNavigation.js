import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const ResponsiveNavigation = ({ onSelect }) => {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });

  return (
    <div>
      {isDesktopOrLaptop ? (
        <Sidebar onSelect={onSelect} />
      ) : (
        <BottomNav onSelect={onSelect} />
      )}
    </div>
  );
};

export default ResponsiveNavigation;
