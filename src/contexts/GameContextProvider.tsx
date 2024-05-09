import { GameContext } from './GameContext';
import React from 'react';
import { useState } from 'react';

interface props {
  children: JSX.Element | JSX.Element[];
}

export const GameContextProvider = ({ children }: props) => {
  // const [gameBoard, setGameBoard] = useState(initialGameBoard)

  return (
    <GameContext.Provider
      value={
        {
          // gameBoard, setGameBoard
        }
      }
    >
      {children}
    </GameContext.Provider>
  );
};
