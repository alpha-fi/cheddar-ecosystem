import { MouseEventHandler, useContext, useMemo, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RNG } from '@/entities/maze/RNG';
import { Box, Img } from '@chakra-ui/react';
import { ModalContainer } from '../ModalContainer';
import { prizes } from '@/constants/doors';

export function DoorsGameboard() {
  const { setCheddarFound, seedId, gameOver, onCloseDoorsModal } =
    useContext(GameContext);

  const [rng, setRng] = useState(new RNG(seedId));
  const doorsOrder = useMemo(() => shuffleArray(prizes), [prizes]);

  function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = rng.nextRange(0, array.length);
      [array[array.length - 1], array[j]] = [array[j], array[array.length - 1]];
    }
    return array.filter((value) => !isNaN(value));
  }

  function addDoorsFeedbackText(extraCheddar: number) {
    if (extraCheddar > 0) {
      return `It has ${extraCheddar} extra cheddar!`;
    }
    return '';
  }

  function handleSelectDoor(
    index: number
  ): MouseEventHandler<HTMLImageElement> {
    return () => {
      const extraCheddar = doorsOrder[index];
      setCheddarFound((prevCheddar) => prevCheddar + extraCheddar);

      gameOver(
        `Congrats! You found the Hidden Door. ${addDoorsFeedbackText(extraCheddar)}`,
        true
      );

      onCloseDoorsModal();
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
