import { Link } from '@chakra-ui/react';
import React from 'react';
interface props {
  handleBuyClick: () => void;
}

export const Ad1Powerup = ({ handleBuyClick }: props) => {
  return (
    <a
      style={{
        outline: '2px solid transparent',
        outlineOffset: '2px',
        color: 'inherit',
        textDecoration: 'underline',
        cursor: 'pointer',
        margin: '1rem',
      }}
      onClick={handleBuyClick}
    >
      Get BOOSTED with PowerUps⚡️
    </a>
  );
};
