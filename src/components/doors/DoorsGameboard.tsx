import { MouseEventHandler, useContext, useMemo, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RNG } from '@/entities/maze/RNG';
import { HStack } from '@chakra-ui/react';
import { prizes } from '@/constants/maze/doors';
import { DOORS_MINIGAME_MESSAGE, EXIT_FOUND_MESSAGE } from '@/constants/maze';
import { Door } from './Door';

export function DoorsGameboard() {
  const {
    setCheddarFound,
    seedId,
    setGameOverMessage,
    hasPlayedDoorsMinigame,
    setHasPlayedDoorsMinigame,
    doorsMinigameReason,
  } = useContext(GameContext);

  const [rng, setRng] = useState(new RNG(seedId));
  const [cheddarFoundInDoor, setCheddarFoundInDoor] = useState<
    undefined | number
  >();
  const [selectedDoor, setSelectedDoor] = useState<{
    index: number | null;
    priceImagePath: string;
    prizeValue: number;
  }>({ index: null, priceImagePath: '', prizeValue: 0 });
  const doorsOrder = useMemo(() => shuffleArray(prizes), [prizes]);

  function shuffleArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = rng.nextRange(0, array.length);
      [array[array.length - 1], array[j]] = [array[j], array[array.length - 1]];
    }
    return array.filter((value) => !isNaN(value));
  }

  function handleSelectDoor(index: number) {
    if (selectedDoor.index === null) {
      setSelectedDoor({
        index,
        priceImagePath: 'assets/cheddar-mouse.png',
        prizeValue: doorsOrder[index],
      });
    }
  }

  function addDoorsFeedbackText(cheddar: number) {
    if (cheddar > 0) {
      return `It has ${cheddar} cheddar!`;
    }
    return `You found nothing in the door. At least you'r not dead!`;
  }

  function actionAfterAnimation(index: number) {
    const cheddar = doorsOrder[index];

    setCheddarFoundInDoor(cheddar);
    setCheddarFound(cheddar);
    setHasPlayedDoorsMinigame(true);
    if (doorsMinigameReason) setGameOverMessage(doorsMinigameReason);
  }

  return (
    <>
      <HStack display={'flex'} spacing="32px" minW={'100%'}>
        {doorsOrder.map((element, index) => {
          return (
            <Door
              key={index}
              index={index}
              keepDoorOpen={hasPlayedDoorsMinigame && index === selectedDoor.index}
              selectedDoor={selectedDoor}
              handleSelectDoor={() => handleSelectDoor(index)}
              actionAfterAnimation={() => actionAfterAnimation(index)}
            />
          );
        })}
      </HStack>
      {cheddarFoundInDoor !== undefined && (
        <span>{`${addDoorsFeedbackText(cheddarFoundInDoor)}`}</span>
      )}
    </>
  );
}
