import { useContext, useEffect } from 'react';
import styles from '@/styles/GameOverModalContent.module.css';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useToast } from '@chakra-ui/react';
import { Facebook, Telegram, Twitter } from '../icons';
import Link from 'next/link';
import { getConfig } from '@/configs/config';

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
    isUserNadabotVerfied,
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
      endGameResponse.cheddarMinted > 0 &&
      isUserNadabotVerfied
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

  const shareText = `I just ${hasWon ? 'won' : 'lost'} ${cheddarFound} Cheddar playing the Cheddar Maze game. Check it out its fun and with more features coming.`;
  const encodedText = encodeURIComponent(shareText);
  const encodedLink = encodeURIComponent('https://cheddar.farm/');

  function getTwitterUrl() {
    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
  }

  function getFbUrl() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedText}`;
  }

  function getTelegramUrl() {
    return `https://telegram.me/share/url?url=${encodedLink}&text=${encodedText}`;
  }

  const { networkData } = getConfig();
  return (
    <div className={styles.gameOverModal}>
      <p className={getMessageStyles()}>{gameOverMessage}</p>
      {hasWon && (
        <p className={styles.earnings}>
          {isUserNadabotVerfied ? (
            <span>
              You have farmed{' '}
              {cheddarFound <= pendingCheddarToMint
                ? cheddarFound
                : pendingCheddarToMint}{' '}
              🧀
            </span>
          ) : (
            <span>
              You have won{' '}
              {cheddarFound <= pendingCheddarToMint
                ? cheddarFound
                : pendingCheddarToMint}{' '}
              🧀, please verify using{' '}
              <Link
                className={styles.link}
                href={networkData.nadaBotUrl}
                target="_blank"
              >
                nada.bot
              </Link>{' '}
              to claim your cheddar.
            </span>
          )}
        </p>
      )}
      {cheddarFound > 0 && !hasWon && (
        <p className={styles.loseEarnings}>
          Your {cheddarFound} 🧀 was swallowed by the enemy.
        </p>
      )}
      <p className={styles.timeRemaining}>
        Time remaining: {remainingMinutes}:{properSecondsFormat}
      </p>
      <p className={styles.score}>{score} Points!</p>
      <div className={styles.shareContainer}>
        Share on
        <a href={getTwitterUrl()} target="_blank" rel="noreferrer">
          <Twitter boxSize={6} />
        </a>
        <a href={getFbUrl()} target="_blank" rel="noreferrer">
          <Facebook boxSize={6} />
        </a>
        <a
          href={getTelegramUrl()}
          target="_blank"
          rel="noreferrer"
          style={{ paddingTop: 3 }}
        >
          <Telegram boxSize={7} />
        </a>
      </div>
    </div>
  );
};
