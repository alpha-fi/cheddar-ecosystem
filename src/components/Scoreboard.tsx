import { useContext, useEffect, useState } from 'react';
import styles from '../styles/Scoreboard.module.css';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { Text } from '@chakra-ui/react';
import { getScoreBoard } from '@/queries/api/maze';
import { GameContext } from '@/contexts/GameContextProvider';

export interface PlayerScoreData {
  accountId: string;
  score: number;
  cheddarEarned: number;
}

function capitalize(string: string) {
  const firstLetter = string.slice(0, 1).toUpperCase();
  const result = firstLetter + string.slice(1, string.length);
  return result;
}

export const Scoreboard = () => {
  const { accountId } = useWalletSelector();
  const { scoreboardResponse } = useContext(GameContext);

  function getRowStyles(index: number, playerScoreData: PlayerScoreData) {
    let rowStyles = `${styles.playerDataContainer} ${index === 0 ? '' : styles.borderTop} ${accountId === playerScoreData.accountId ? styles.userBackground : ''}`;

    return rowStyles;
  }
  return (
    <div>
      {/* <div className={styles.titlesContainer}>
        <h3 className={styles.title}>User</h3>
        <h3 className={styles.title}>Score</h3>
      </div> */}
      <div className={styles.scoreboardContainer}>
        {scoreboardResponse &&
          scoreboardResponse.ok &&
          scoreboardResponse.scoreboard.map((playerScoreData, index) => {
            return (
              <div className={getRowStyles(index, playerScoreData)}>
                <div className={styles.topPart}>
                  <span className={styles.position}>{`#${index + 1}`}</span>
                  <Text className={styles.userName}>
                    {capitalize(playerScoreData.accountId)}
                  </Text>
                </div>
                <div className={styles.bottomPart}>
                  <span>Cheese found: {playerScoreData.cheddarEarned}</span>
                  <span>Score: {playerScoreData.score}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
