'use client';
import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { GameboardContainer } from './GameboardContainer';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { ntoy, yton } from '@/contracts/contractUtils';
import { useGetCheddarMetadata } from '@/hooks/cheddar';
import { useGetIsAllowedResponse } from '@/hooks/maze';
import ModalWelcome from '../ModalWelcome';
import { useToast } from '@chakra-ui/react';
import { useGlobalContext } from '@/contexts/GlobalContext';

export default function MazeContainer() {
  const {
    mazeData,
    playerPosition,
    score,
    gameOverFlag,
    gameOverMessage,
    selectedColorSet,
    isPowerUpOn,
    setIsPowerUpOn,
    remainingTime,
    handleKeyPress,
    restartGame,
  } = useContext(GameContext);

  const { addresses, cheddarBalance, isCheddarBalanceLoading } = useGlobalContext()

  const { isLoading: isLoadingCheddarMetadata } = useGetCheddarMetadata();

  const {
    data: isAllowedResponse,
    isLoading: isLoadingIsAllowed,
    error: userAllowedError,
  } = useGetIsAllowedResponse();

  const [queriesLoaded, setQueriesLoaded] = useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);

  if (!queriesLoaded) {
    if (
      !isCheddarBalanceLoading &&
      !isLoadingCheddarMetadata &&
      !isLoadingIsAllowed
    ) {
      setQueriesLoaded(true);
    }
  }

  const toast = useToast();

  const minCheddarRequired = ntoy(555);

  useEffect(() => {
    function doesUserHaveEnoughBalance() {
      if (addresses["base"]) {
        return true;
      } else if(!cheddarBalance){
        return false;
      }
      return minCheddarRequired <= cheddarBalance;
    }
    setHasEnoughBalance(doesUserHaveEnoughBalance());
  }, [cheddarBalance, addresses, isAllowedResponse]);

  function handlePowerUpClick() {
    setIsPowerUpOn(!isPowerUpOn);
    // Additional logic if needed
  }

  function isMobile() {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  }

  const cellSize = 40;

  function initialized() {
    // Check if all necessary state variables are not null or undefined
    return (
      selectedColorSet !== null &&
      mazeData !== null &&
      Array.isArray(mazeData) &&
      mazeData[0] !== undefined &&
      playerPosition !== null &&
      score !== null &&
      remainingTime !== null &&
      gameOverFlag !== null &&
      gameOverMessage !== null &&
      handleKeyPress !== null &&
      restartGame !== null
    );
  }

  return (
    <>
      <ModalWelcome />
      {initialized() && ( // Replace `condition` with your actual condition
        <GameboardContainer
          remainingMinutes={Math.floor(remainingTime / 60)}
          remainingSeconds={remainingTime % 60}
          handlePowerUpClick={handlePowerUpClick}
          cellSize={cellSize}
          hasEnoughBalance={hasEnoughBalance}
          minCheddarRequired={yton(minCheddarRequired.toString())}
          isAllowedResponse={isAllowedResponse}
        />
      )}
    </>
  );
}
