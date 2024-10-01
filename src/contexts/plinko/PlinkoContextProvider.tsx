import { MINIGAME_MAX_BALLS_AMOUNT } from '@/constants/plinko';
import React, { ReactNode, createContext, useState } from 'react';

interface props {
  children: ReactNode;
}

interface PlinkoContextProps {
  // resetQuery: boolean;
  // setResetQuery: React.Dispatch<React.SetStateAction<boolean>>;
  thrownBallsQuantity: number;
  setThrownBallsQuantity: React.Dispatch<React.SetStateAction<number>>;

  isMinigame: boolean;
  setIsMinigame: React.Dispatch<React.SetStateAction<boolean>>;

  ballsYPosition: number[];
  setBallsYPosition: React.Dispatch<React.SetStateAction<number[]>>;
}

export const PlinkoContext = createContext<PlinkoContextProps>(
  {} as PlinkoContextProps
);

export const PlinkoContextProvider = ({ children }: props) => {
  // const [resetQuery, setResetQuery] = useState(false);
  const [thrownBallsQuantity, setThrownBallsQuantity] = useState(0);
  const [isMinigame, setIsMinigame] = useState(false);

  const [ballsYPosition, setBallsYPosition] = useState<number[]>(
    isMinigame ? Array.from(Array(MINIGAME_MAX_BALLS_AMOUNT).keys()).fill(0) : []
  );

  return (
    <PlinkoContext.Provider
      value={{
        // resetQuery,
        // setResetQuery,
        thrownBallsQuantity,
        setThrownBallsQuantity,
        isMinigame,
        setIsMinigame,
        ballsYPosition,
        setBallsYPosition,
      }}
    >
      {children}
    </PlinkoContext.Provider>
  );
};
