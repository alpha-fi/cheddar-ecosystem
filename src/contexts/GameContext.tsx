import React, { createContext } from 'react';

export interface GameContextProps {
  // pointsUsedInPlayerA5: number,
  // setPointsUsedInPlayerA1: React.Dispatch<React.SetStateAction<number>>,
}

export const GameContext = createContext<GameContextProps>(
  {} as GameContextProps
);
