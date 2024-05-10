import { Coordinates } from '@/entities/interfaces';
import React, { ReactNode, createContext, useState } from 'react';

interface props {
  children: ReactNode;
}

export interface MazeTileData {
  isPath: boolean;
  isActive: boolean;
  enemyWon: boolean;

  hasCheese: boolean;
  hasEnemy: boolean;
  hasExit: boolean;
  hasCartel: boolean;
}

interface GameContextProps {
  mazeData: MazeTileData[][];
  setMazeData: React.Dispatch<React.SetStateAction<MazeTileData[][]>>;

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

  direction: 'right' | 'left' | 'down' | 'up';
  setDirection: React.Dispatch<
    React.SetStateAction<'right' | 'left' | 'down' | 'up'>
  >;

  selectedColorSet: {
    backgroundColor: string;
    pathColor: string;
    nonPathColor: string;
    textColor: string;
    rarity: string;
    backgroundImage: string;
  };
  setSelectedColorSet: React.Dispatch<
    React.SetStateAction<{
      backgroundColor: string;
      pathColor: string;
      nonPathColor: string;
      textColor: string;
      rarity: string;
      backgroundImage: string;
    }>
  >;

  lastCellX: number;
  setLastCellX: React.Dispatch<React.SetStateAction<number>>;
  lastCellY: number;
  setLastCellY: React.Dispatch<React.SetStateAction<number>>;

  hasPowerUp: boolean;
  setHasPowerUp: React.Dispatch<React.SetStateAction<boolean>>;

  isPowerUpOn: boolean;
  setIsPowerUpOn: React.Dispatch<React.SetStateAction<boolean>>;

  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;

  timeLimitInSeconds: number;
  setTimeLimitInSeconds: React.Dispatch<React.SetStateAction<number>>;

  remainingMinutes: number;
  setRemainingMinutes: React.Dispatch<React.SetStateAction<number>>;

  remainingSeconds: number;
  setRemainingSeconds: React.Dispatch<React.SetStateAction<number>>;

  cheeseCooldown: boolean;
  setCheeseCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  enemyCooldown: boolean;
  setEnemyCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  moves: number;
  setMoves: React.Dispatch<React.SetStateAction<number>>;

  won: boolean;
  setWon: React.Dispatch<React.SetStateAction<boolean>>;
  touchStart: Coordinates;
  setTouchStart: React.Dispatch<React.SetStateAction<Coordinates>>;
  touchEnd: Coordinates;
  setTouchEnd: React.Dispatch<React.SetStateAction<Coordinates>>;
  coveredCells: number;
  setCoveredCells: React.Dispatch<React.SetStateAction<number>>;
}

export const GameContext = createContext<GameContextProps>(
  {} as GameContextProps
);

export const GameContextProvider = ({ children }: props) => {
  const [mazeData, setMazeData] = useState([[]] as MazeTileData[][]);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [score, setScore] = useState(0);
  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [timerStarted, setTimerStarted] = useState(false);
  const [direction, setDirection] = useState(
    'right' as 'right' | 'left' | 'down' | 'up'
  );
  const [selectedColorSet, setSelectedColorSet] = useState({
    backgroundColor: '',
    pathColor: '',
    nonPathColor: '',
    textColor: '',
    rarity: '',
    backgroundImage: '',
  });
  const [lastCellX, setLastCellX] = useState(-1);
  const [lastCellY, setLastCellY] = useState(-1);
  const [hasPowerUp, setHasPowerUp] = useState(false);
  const [isPowerUpOn, setIsPowerUpOn] = useState(false);

  const [timeLimitInSeconds, setTimeLimitInSeconds] = useState(120);
  const [remainingTime, setRemainingTime] = useState(timeLimitInSeconds);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [cheeseCooldown, setCheeseCooldown] = useState(false);
  const [enemyCooldown, setEnemyCooldown] = useState(false);
  const [moves, setMoves] = useState(0);

  const [won, setWon] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: -1, y: -1 });
  const [touchEnd, setTouchEnd] = useState({ x: -1, y: -1 });
  const [coveredCells, setCoveredCells] = useState(0);

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
        timeLimitInSeconds,
        setTimeLimitInSeconds,
        remainingTime,
        setRemainingTime,
        remainingMinutes,
        setRemainingMinutes,
        remainingSeconds,
        setRemainingSeconds,
        cheeseCooldown,
        setCheeseCooldown,
        enemyCooldown,
        setEnemyCooldown,
        moves,
        setMoves,
        won,
        setWon,
        touchStart,
        setTouchStart,
        touchEnd,
        setTouchEnd,
        coveredCells,
        setCoveredCells,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
