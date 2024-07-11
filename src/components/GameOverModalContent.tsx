import { useContext, useEffect } from 'react';
import styles from '../styles/GameOverModalContent.module.css';
import { GameContext } from '@/contexts/GameContextProvider';
import { useToast } from '@chakra-ui/react';

export const GameOverModalContent = () => {
  const {
    remainingMinutes,
    remainingSeconds,
    score,
    cheddarFound,
    gameOverMessage,
    hasWon,
    pendingCheddarToMint,
    endGameResponse,
  } = useContext(GameContext);

  const toast = useToast();

  const properSecondsFormat =
    remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

  function getMessageStyles() {
    return `${styles.gameOver} ${hasWon ? styles.win : styles.lost}`;
  }

  useEffect(() => {
    if (
      endGameResponse &&
      endGameResponse.ok &&
      endGameResponse.cheddarMinted > 0
    ) {
      toast({
        title: 'Cheddar Minted Successfully!',
        status: 'success',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }

    if (endGameResponse && !endGameResponse.ok) {
      toast({
        title: 'Error Minting Cheddar',
        status: 'error',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [endGameResponse, toast]);

  return (
    <div className={styles.gameOverModal}>
      <p className={getMessageStyles()}>{gameOverMessage}</p>
      <p className={styles.score}>{score} Points!</p>
      <p className={styles.timeRemaining}>
        Time remaining: {remainingMinutes}:{properSecondsFormat}
      </p>
      {cheddarFound > 0 && hasWon && (
        <p className={styles.earnings}>
          You have farmed{' '}
          {cheddarFound <= pendingCheddarToMint
            ? cheddarFound
            : pendingCheddarToMint}{' '}
          🧀
        </p>
      )}
      {cheddarFound > 0 && !hasWon && (
        <p className={styles.loseEarnings}>
          Your {cheddarFound} 🧀 was swallowed by the enemy.
        </p>
      )}
    </div>
  );
};
