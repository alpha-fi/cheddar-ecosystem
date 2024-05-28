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
  } = useContext(GameContext);

  const propperSecondsFormat = remainingSeconds === 0 ? '00' : remainingSeconds;

  function getMessageStyles() {
    return `${styles.gameOver} ${score > 0 ? styles.win : styles.lost}`;
  }

  return (
    <div className={styles.gameOverModal}>
      <p className={getMessageStyles()}>{gameOverMessage}</p>
      {score > 0 && <p className={styles.score}>{score} Points!</p>}
      <p className={styles.timeRemaining}>
        Time remaining: {remainingMinutes}:{propperSecondsFormat}
      </p>
      {cheddarFound > 0 && (
        <p className={styles.earnings}>You have earned {cheddarFound} 🧀</p>
      )}
    </div>
  );
};
