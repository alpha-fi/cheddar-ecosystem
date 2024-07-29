import { MouseEventHandler, useContext, useMemo, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RNG } from '@/entities/maze/RNG';
import { HStack } from '@chakra-ui/react';
import { prizes } from '@/constants/maze/doors';
import { DOORS_MINIGAME_MESSAGE, EXIT_FOUND_MESSAGE } from '@/constants/maze';
import { Door } from './Door';

export function DoorsGameboard() {
  const { setCheddarFound, seedId, gameOver, onCloseDoorsModal } =
    useContext(GameContext);

  const [rng, setRng] = useState(new RNG(seedId));
  const [selectedDoor, setSelectedDoor] = useState<{
    index: number | null;
    priceImagePath: string;
  }>({ index: null, priceImagePath: '' });
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

  function handleSelectDoor(index: number) {
    if (selectedDoor.index === null) {
      const cheddar = doorsOrder[index];
      setSelectedDoor({ index, priceImagePath: 'assets/cheddar-mouse.png' });
      setCheddarFound(cheddar);
    }
  }

  function actionAfterAnimation(index: number) {
    const cheddar = doorsOrder[index];

    gameOver(
      `${DOORS_MINIGAME_MESSAGE} ${addDoorsFeedbackText(cheddar)}`,
      true
    );

    onCloseDoorsModal();
  }

  return (
    <HStack display={'flex'} spacing="32px">
      {doorsOrder.map((element, index) => {
        return (
          <Door
            key={index}
            index={index}
            selectedDoor={selectedDoor}
            handleSelectDoor={() => handleSelectDoor(index)}
            actionAfterAnimation={actionAfterAnimation}
          />
        );
      })}
    </HStack>
  );
}
