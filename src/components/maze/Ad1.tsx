import { Link } from '@chakra-ui/react';
import React from 'react';
interface props {
  handleBuyClick: () => void;
}

export const Ad1 = ({ handleBuyClick }: props) => {
  return (
    <Link textDecoration="underline" onClick={handleBuyClick}>
      Get BOOSTED with PowerUps⚡️
    </Link>
  );
};
