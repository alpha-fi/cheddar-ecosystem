import { Stack } from '@chakra-ui/react';
import { Ad1 } from './Ad1';
import { Ad2 } from './Ad2';
import { Ad3 } from './Ad3';

interface Props {
  handleBuyClick: () => void;
}

export const RandomAd = ({ handleBuyClick }: Props) => {
  const AdArray = [
    <Ad1 key="Ad1" handleBuyClick={handleBuyClick} />,
    <Ad2 key="Ad2" />,
    <Ad3 key="Ad3" />,
  ];

  const randomIndex = Math.floor(Math.random() * AdArray.length);

  return (
    <Stack
      flexDirection={'column'}
      border={'2px solid black'}
      borderRadius={'10px'}
      m={'1rem'}
      boxShadow={'11px 10px 32px -13px rgba(0,0,0,0.75)'}
    >
      {AdArray[randomIndex]}
    </Stack>
  );
};
