import { useState } from 'react';
import styles from '../styles/Scoreboard.module.css';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { Text } from '@chakra-ui/react';

interface playerScoreData {
  position: number;
  userName: string;
  score: number;
}

const mockScoreboard = [
  {
    position: 1,
    userName: 'abcdefg',
    score: 11,
  },
  {
    position: 2,
    userName:
      '1bca60321502ac5bf48525b20a96947e64deef14aa88fa5028522615be4b5ac6',
    score: 10,
  },
  {
    position: 3,
    userName: 'silkking.testnet',
    score: 9,
  },
  {
    position: 4,
    userName: 'kenrou-it.testnet',
    score: 8,
  },
  {
    position: 5,
    userName: 'e',
    score: 7,
  },
  {
    position: 6,
    userName: 'f',
    score: 6,
  },
  {
    position: 7,
    userName: 'g',
    score: 5,
  },
  {
    position: 8,
    userName: 'h',
    score: 4,
  },
  {
    position: 9,
    userName: 'i',
    score: 3,
  },
  {
    position: 10,
    userName: 'j',
    score: 2,
  },
  {
    position: 11,
    userName: 'k',
    score: 1,
  },
];

function capitalize(string: string) {
  const firstLetter = string.slice(0, 1).toUpperCase();
  const result = firstLetter + string.slice(1, string.length);
  return result;
}

export const Scoreboard = () => {
  const { accountId } = useWalletSelector();
  const [scoreboard, setScoreboard] =
    useState<playerScoreData[]>(mockScoreboard);

  function getRowStyles(index: number, player: playerScoreData) {
    let rowStyles = `${styles.playerDataContainer} ${index === 0 ? '' : styles.borderTop} ${accountId === player.userName ? styles.userBackground : ''}`;

    return rowStyles;
  }
  return (
    <div>
      <div className={styles.titlesContainer}>
        <h3 className={styles.title}>User</h3>
        <h3 className={styles.title}>Score</h3>
      </div>
      <div className={styles.scoreboardContainer}>
        {scoreboard.map((player, index) => {
          return (
            <div className={getRowStyles(index, player)}>
              <div className={styles.leftPortion}>
                <span className={styles.position}>{`#${player.position}`}</span>
                <Text className={styles.userName}>
                  {capitalize(player.userName)}
                </Text>
              </div>
              <span>{player.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
