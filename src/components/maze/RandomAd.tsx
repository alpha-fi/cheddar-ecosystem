import { Stack } from '@chakra-ui/react';
import { Ad1Powerup } from './Ad1Powerup';
import { Ad2NewMiniGame } from './Ad2NewMiniGame';
import { Ad3Plinko } from './Ad3Plinko';
import { useEffect, useMemo } from 'react';

interface Props {
  handleBuyClick: () => void;
}

export const RandomAd = ({ handleBuyClick }: Props) => {
  const AdArray = useMemo(() => {
    return [
      <Ad1Powerup handleBuyClick={handleBuyClick} />,
      <Ad2NewMiniGame />,
      <Ad3Plinko />,
    ];
  }, []);

  const randomIndex = useMemo(() => {
    return Math.floor(Math.random() * AdArray.length);
  }, []);

  return (
    <div
      style={{
        border: '2px solid black',
        borderRadius: '10px',
        margin: '1rem',
        boxShadow: '11px 10px 32px -13px rgba(0,0,0,0.75)',
      }}
    >
      {AdArray[randomIndex]}
    </div>
  );
};
