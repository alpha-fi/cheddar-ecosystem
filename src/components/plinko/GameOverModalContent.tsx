import { useContext, useEffect } from 'react';
import styles from '@/styles/GameOverModalContent.module.css';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useToast } from '@chakra-ui/react';
import { ToastsContext } from '@/contexts/ToastsContext';

interface Props {
  prizeName: string;
  cheddarFound: number;
  endGameResponse: any;
}

export const GameOverModalContent = ({
  prizeName,
  cheddarFound,
  endGameResponse,
}: Props) => {
  const { pendingCheddarToMint, isUserNadabotVerfied, isUserHolonymVerified } =
    useContext(GameContext);

  const { showToast } = useContext(ToastsContext);

  const hasWon = prizeName !== 'splat';

  const gameOverMessage = hasWon ? 'So nice!' : `Splat!`;

  function getMessageStyles() {
    return `${styles.gameOver} ${hasWon ? styles.win : styles.lost}`;
  }

  useEffect(() => {
    if (
      endGameResponse &&
      endGameResponse.ok &&
      endGameResponse.cheddarMinted > 0 &&
      (isUserNadabotVerfied || isUserHolonymVerified)
    ) {
      showToast('Cheddar Minted Successfully!', 'success');
    }

    if (endGameResponse && !endGameResponse.ok) {
      showToast('Error Minting Cheddar', 'error');
    }
  }, [endGameResponse]);

  return (
    <div className={styles.gameOverModal}>
      <p className={getMessageStyles()}>{gameOverMessage}</p>
      {hasWon && (
        <p className={styles.earnings}>
          You have earned{' '}
          {cheddarFound <= pendingCheddarToMint
            ? cheddarFound
            : pendingCheddarToMint}{' '}
          🧀
        </p>
      )}
      {!hasWon && <p className={styles.loseEarnings}>Better luck next time!</p>}
    </div>
  );
};
