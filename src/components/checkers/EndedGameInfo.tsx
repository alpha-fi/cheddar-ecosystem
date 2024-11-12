import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { yton } from '@/contracts/contractUtils';
import { getPlayerByIndex, getTokenName } from '@/lib/checkers';
import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';

export const EndedGameInfo = () => {
  const { gameData, handleFinishGame } = useContext(CheckersContext);

  return (
    <>
      <div id="near-game-finished" className="subtitle ">
        Game winner:{' '}
        <span id="near-game-winner">
          {getPlayerByIndex(gameData, gameData.winner_index)}
        </span>
        <br></br>
        Reward:{' '}
        <span id="near-game-reward">
          {yton(gameData.reward.balance)}{' '}
          {getTokenName(gameData.reward.token_id)}
        </span>
      </div>
      <Button colorScheme="purple" onClick={handleFinishGame}>
        Close game
      </Button>
    </>
  );
};
