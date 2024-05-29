import { useContext } from 'react';
import styles from '../styles/GameOverModalContent.module.css';
import { GameContext } from '@/contexts/GameContextProvider';

export const GameOverModalContent = () => {
  const {
    remainingMinutes,
    remainingSeconds,
    score,
    cheddarFound,
    gameOverMessage,
    hasWon,
  } = useContext(GameContext);

  const propperSecondsFormat = remainingSeconds === 0 ? '00' : remainingSeconds;

  function getMessageStyles() {
    return `${styles.gameOver} ${hasWon ? styles.win : styles.lost}`;
  }

  return (
    <div className={styles.gameOverModal}>
      <p className={getMessageStyles()}>{gameOverMessage}</p>
      <p className={styles.score}>{score} Points!</p>
      <p className={styles.timeRemaining}>
        Time remaining: {remainingMinutes}:{propperSecondsFormat}
      </p>
      {cheddarFound > 0 && (
        <p className={styles.earnings}>You have earned {cheddarFound} 🧀</p>
      )}
    </div>
  );
};
