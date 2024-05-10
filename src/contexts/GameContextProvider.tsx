import { GameContext } from './GameContext';
import React, { ReactNode } from 'react';
import { useState } from 'react';

interface props {
  children: ReactNode;
}

export const GameContextProvider = ({ children }: props) => {
  const [mazeData, setMazeData] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [score, setScore] = useState(0);
  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [timerStarted, setTimerStarted] = useState(false);
  const [direction, setDirection] = useState('right');
  const [selectedColorSet, setSelectedColorSet] = useState(null);
  const [lastCellX, setLastCellX] = useState(null);
  const [lastCellY, setLastCellY] = useState(null);
  const [hasPowerUp, setHasPowerUp] = useState(false);
  const [isPowerUpOn, setIsPowerUpOn] = useState(false);

  return (
    <GameContext.Provider
      value={{
        mazeData,
        setMazeData,
        playerPosition,
        setPlayerPosition,
        score,
        setScore,
        gameOverFlag,
        setGameOverFlag,
        gameOverMessage,
        setGameOverMessage,
        timerStarted,
        setTimerStarted,
        direction,
        setDirection,
        selectedColorSet,
        setSelectedColorSet,
        lastCellX,
        setLastCellX,
        lastCellY,
        setLastCellY,
        hasPowerUp,
        setHasPowerUp,
        isPowerUpOn,
        setIsPowerUpOn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
