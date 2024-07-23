import { MouseEventHandler, useContext, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RNG } from '@/entities/maze/RNG';
import { Box, Img } from '@chakra-ui/react';
import { ModalContainer } from '../ModalContainer';

export function DoorsGameboard() {
  const { setCheddarFound, seedId, gameOver } = useContext(GameContext);

  const [rng, setRng] = useState(new RNG(seedId));

  const prizes = [0, 5, 15];
  const doorsOrder = shuffleArray(prizes);

  function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = rng.nextRange(0, array.length);
      [array[array.length], array[j]] = [array[j], array[array.length]];
    }
    return array.filter((value) => !isNaN(value));
  }

  function handleSelectDoor(
    index: number
  ): MouseEventHandler<HTMLImageElement> {
    return () => {
      setCheddarFound((prevCheddar) => prevCheddar + doorsOrder[index]);
      gameOver(
        `Your Hidden Door have ${doorsOrder[index]} extra cheddar!.`,
        true
      );
    };
  }

  return (
    <Box display={'flex'}>
      {doorsOrder.map((element, index) => {
        return (
          <Img
            w={`${100 / doorsOrder.length}%`}
            onClick={handleSelectDoor(index)}
            src={'assets/door.svg'}
          />
        );
      })}
    </Box>
  );
}
