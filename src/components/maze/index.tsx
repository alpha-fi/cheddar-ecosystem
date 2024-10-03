'use client';
import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { GameboardContainer } from './GameboardContainer';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { ntoy, yton } from '@/contracts/contractUtils';
import { useGetCheddarBalance, useGetCheddarMetadata } from '@/hooks/cheddar';
import { useGetIsAllowedResponse } from '@/hooks/maze';
import ModalWelcome from '../ModalWelcome';
import { useToast } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

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

  const { selector, accountId } = useWalletSelector();
  const { address } = useAccount();
  const { data: cheddarMetadata, isLoading: isLoadingCheddarMetadata } =
    useGetCheddarMetadata();
  const { data: cheddarBalanceData, isLoading: isLoadingCheddarBalance } =
    useGetCheddarBalance();
  const {
    data: isAllowedResponse,
    isLoading: isLoadingIsAllowed,
    error: userAllowedError,
  } = useGetIsAllowedResponse();

  const [queriesLoaded, setQueriesLoaded] = useState(false);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);

  if (!queriesLoaded) {
    if (
      !isLoadingCheddarBalance &&
      !isLoadingCheddarMetadata &&
      !isLoadingIsAllowed
    ) {
      setQueriesLoaded(true);
    }
  }

  const toast = useToast();
  useEffect(() => {
    if (userAllowedError) {
      toast({
        title: 'Error occured while verifying current user!',
        status: 'error',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [userAllowedError]);

  const minCheddarRequired = ntoy(555);

  useEffect(() => {
    function doesUserHaveEnoughBalance() {
      if (address) {
        return true;
      } else if (!cheddarBalanceData) return false;

      return minCheddarRequired <= cheddarBalanceData!;
    }
    setHasEnoughBalance(doesUserHaveEnoughBalance());
  }, [cheddarBalanceData, accountId, address, selector, isAllowedResponse]);

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
