import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';

export const CurrentGameInfo = () => {
  const { gameData, handleGiveUp } = useContext(CheckersContext);

  return (
    <div id="near-game" className="">
      <div id="near-game-turn-block" className="subtitle">
        There is an ongoing game on turn #
        <span id="near-game-turn">{gameData.turns}</span>
      </div>
      <div id="near-game-give-up">
        <Button colorScheme="purple" onClick={handleGiveUp}>
          Concede
        </Button>
      </div>
    </div>
  );
};
