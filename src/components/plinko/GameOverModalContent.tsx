import { useContext, useEffect } from 'react';
import styles from '@/styles/GameOverModalContent.module.css';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useToast } from '@chakra-ui/react';

interface Props {
  cheddarFound: number;
  endGameResponse: any;
}

export const GameOverModalContent = ({
  cheddarFound,
  endGameResponse,
}: Props) => {
  const { pendingCheddarToMint } = useContext(GameContext);

  const hasWon = cheddarFound > 0;

  const gameOverMessage = hasWon ? 'So nice!' : `Splat!`;

  const toast = useToast();

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
