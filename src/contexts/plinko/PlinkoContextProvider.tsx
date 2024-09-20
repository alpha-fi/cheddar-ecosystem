import { MAX_BALLS_AMOUNT } from '@/constants/plinko';
import React, { ReactNode, createContext, useState } from 'react';

interface props {
  children: ReactNode;
}

interface PlinkoContextProps {
  resetQuery: boolean;
  setResetQuery: React.Dispatch<React.SetStateAction<boolean>>;
  thrownBallsQuantity: number;
  setThrownBallsQuantity: React.Dispatch<React.SetStateAction<number>>;

  isMinigame: boolean;
  setIsMinigame: React.Dispatch<React.SetStateAction<boolean>>;

  ballsYPosition: number[];
  setBallsYPosition: React.Dispatch<React.SetStateAction<number[]>>;

  MAX_BALLS_AMOUNT_IN_GAME: number | undefined;
}

export const PlinkoContext = createContext<PlinkoContextProps>(
  {} as PlinkoContextProps
);

export const PlinkoContextProvider = ({ children }: props) => {
  const [resetQuery, setResetQuery] = useState(false);
  const [thrownBallsQuantity, setThrownBallsQuantity] = useState(0);
  const [isMinigame, setIsMinigame] = useState(false);
  const MAX_BALLS_AMOUNT_IN_GAME = isMinigame ? MAX_BALLS_AMOUNT : undefined;

  const [ballsYPosition, setBallsYPosition] = useState<number[]>(
    isMinigame ? Array.from(Array(MAX_BALLS_AMOUNT_IN_GAME).keys()).fill(0) : []
  );

  return (
    <PlinkoContext.Provider
      value={{
        resetQuery,
        setResetQuery,
        thrownBallsQuantity,
        setThrownBallsQuantity,
        isMinigame,
        setIsMinigame,
        ballsYPosition,
        setBallsYPosition,
        MAX_BALLS_AMOUNT_IN_GAME,
      }}
    >
      {children}
    </PlinkoContext.Provider>
  );
};
