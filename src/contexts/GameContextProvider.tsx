import { Coordinates } from '@/entities/interfaces';
import React, { ReactNode, createContext, useState } from 'react';

interface props {
  children: ReactNode;
}

interface GameContextProps {
  mazeData: any;
  setMazeData: React.Dispatch<React.SetStateAction<any>>;

  playerPosition: Coordinates;
  setPlayerPosition: React.Dispatch<React.SetStateAction<Coordinates>>;

  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;

  gameOverFlag: boolean;
  setGameOverFlag: React.Dispatch<React.SetStateAction<boolean>>;

  gameOverMessage: string;
  setGameOverMessage: React.Dispatch<React.SetStateAction<string>>;

  timerStarted: boolean;
  setTimerStarted: React.Dispatch<React.SetStateAction<boolean>>;

  direction: string;
  setDirection: React.Dispatch<React.SetStateAction<string>>;

  selectedColorSet: any;
  setSelectedColorSet: React.Dispatch<React.SetStateAction<any>>;

  lastCellX: any;
  setLastCellX: React.Dispatch<React.SetStateAction<any>>;
  lastCellY: any;
  setLastCellY: React.Dispatch<React.SetStateAction<any>>;

  hasPowerUp: boolean;
  setHasPowerUp: React.Dispatch<React.SetStateAction<boolean>>;

  isPowerUpOn: boolean;
  setIsPowerUpOn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameContext = createContext<GameContextProps>(
  {} as GameContextProps
);

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
