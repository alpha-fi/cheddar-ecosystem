import React, { createContext } from 'react';
import { coordinates } from '@/entities/interfaces';

export interface GameContextProps {
  mazeData: any;
  setMazeData: React.Dispatch<React.SetStateAction<any>>;

  playerPosition: coordinates;
  setPlayerPosition: React.Dispatch<React.SetStateAction<coordinates>>;

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
