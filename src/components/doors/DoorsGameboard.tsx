import { MouseEventHandler, useContext, useMemo, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RNG } from '@/entities/maze/RNG';
import { Box, Img } from '@chakra-ui/react';
import { ModalContainer } from '../ModalContainer';
import { prizes } from '@/constants/maze/doors';
import { DOORS_MINIGAME_MESSAGE, EXIT_FOUND_MESSAGE } from '@/constants/maze';

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

  function addDoorsFeedbackText(cheddar: number) {
    if (cheddar > 0) {
      return `It has ${cheddar} cheddar!`;
    }
    return `You found nothing in the door. At least you'r not dead!`;
  }

  function handleSelectDoor(
    index: number
  ): MouseEventHandler<HTMLImageElement> {
    return () => {
      const cheddar = doorsOrder[index];
      setCheddarFound(cheddar);

      gameOver(
        `${DOORS_MINIGAME_MESSAGE} ${addDoorsFeedbackText(cheddar)}`,
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
