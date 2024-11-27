import { useContext, useEffect } from 'react';
import styles from '@/styles/GameOverModalContent.module.css';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useToast } from '@chakra-ui/react';

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

  const hasWon = prizeName !== 'splat';

  const gameOverMessage = hasWon ? 'So nice!' : `Splat!`;

  const toast = useToast();

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
      toast({
        title: 'Cheddar added to Farmed Balance!',
        status: 'success',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }

    if (endGameResponse && !endGameResponse.ok) {
      toast({
        title: 'Failed to add Cheddar to Farmed Balance',
        status: 'error',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [endGameResponse]);

  return (
    <div className={styles.gameOverModal}>
      <p className={getMessageStyles()}>{gameOverMessage}</p>
      {hasWon &&
        (pendingCheddarToMint === 0 || cheddarFound > pendingCheddarToMint ? (
          <p className={styles.earnings}>
            You rocked it today by reaching the daily 555 Cheddar limit. Let’s
            go again tomorrow
          </p>
        ) : (
          <p className={styles.earnings}>
            You have earned{' '}
            {cheddarFound <= pendingCheddarToMint
              ? cheddarFound
              : pendingCheddarToMint}{' '}
            🧀
          </p>
        ))}
      {!hasWon && <p className={styles.loseEarnings}>Better luck next time!</p>}
    </div>
  );
};
