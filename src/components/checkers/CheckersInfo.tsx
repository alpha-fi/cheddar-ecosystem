import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { yton } from '@/contracts/contractUtils';
import { getPlayerByIndex, getTokenName } from '@/lib/checkers';
import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { FindGame } from './FindGame';
import { CurrentGameInfo } from './CurrentGameInfo';
import { EndedGameInfo } from './EndedGameInfo';

export const CheckersInfo = () => {
  const { gameData, accountId, onOpen } = useContext(CheckersContext);

  return (
    <div className="info">
      <h1>Cheddar Checkers</h1>

      {!accountId && (
        <div className="only-before-login">
          <div className="subtitle">
            Login with NEAR account (or{' '}
            <a href="https://www.mynearwallet.com/" target="_blank">
              create one for free!
            </a>
            )
          </div>
        </div>
      )}
      {accountId && (
        <div className="only-after-login">
          {!gameData && <FindGame />}

          {gameData && gameData.winner_index === null && <CurrentGameInfo />}

          {gameData && gameData.winner_index !== null && <EndedGameInfo />}
        </div>
      )}
      <div style={{ paddingTop: '10px' }}>
        <a onClick={onOpen} style={{ cursor: 'pointer' }}>
          How to play / Rules (Click to view)
        </a>
      </div>
    </div>
  );
};
