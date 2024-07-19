import { useContext, useEffect, useRef, useState } from 'react';
import styles from '@/styles/Scoreboard.module.css';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { getScoreBoard } from '@/queries/maze/api';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useGetScoreboard } from '@/hooks/maze';
import { smartTrim } from '@/utilities/exportableFunctions';

export interface PlayerScoreData {
  accountId: string;
  score: number;
  cheddarEarned: number;
}

interface Props {
  allowExpand?: boolean;
  smallVersion?: boolean;
}

export const Scoreboard = ({
  allowExpand = false,
  smallVersion = false,
}: Props) => {
  const { accountId } = useWalletSelector();
  const [rowAmount, setRowAmount] = useState(4);

  const { data: scoreboardResponse, isLoading: isLoadingScoreboard } =
    useGetScoreboard();

  const firstLoggedUserOccurrence = useRef(-1);

  function getRowStyles(index: number, playerScoreData: PlayerScoreData) {
    let rowStyles = `${styles.rowContainer} ${smallVersion ? styles.smallVersionSize : styles.bigVersionSize} ${index === 0 ? '' : styles.borderTop} ${accountId === playerScoreData.accountId ? styles.userBackground : ''}`;

    return rowStyles;
  }

  function handleIncreaseElementsToShow() {
    setRowAmount(rowAmount + 5);
  }

  function getHeaderStyles() {
    return `${styles.titlesContainer} ${smallVersion ? styles.smallVersionSize : styles.bigVersionSize}`;
  }

  return (
    <>
      <table className={styles.tableContainer}>
        <thead className={getHeaderStyles()}>
          <tr>
            <th className={`${styles.th} ${styles.firstElement}`}>#</th>
            <th className={styles.th}>User</th>
            <th className={styles.th}>
              {RenderCheddarIcon({ width: '2rem' })}
            </th>
            <th className={styles.th}>Score</th>
          </tr>
        </thead>
        <tbody className={styles.tBody}>
          {scoreboardResponse &&
            scoreboardResponse.ok &&
            scoreboardResponse.scoreboard.map((playerScoreData, index) => {
              if (
                firstLoggedUserOccurrence.current === -1 &&
                playerScoreData.accountId === accountId
              ) {
                firstLoggedUserOccurrence.current = index;
              }

              if (
                index > rowAmount &&
                firstLoggedUserOccurrence.current !== index
              )
                return <></>;
              return (
                <tr
                  key={`position-key-${index}`}
                  className={getRowStyles(index, playerScoreData)}
                >
                  <td
                    className={`${styles.firstElement} ${styles.position}`}
                  >{`${index + 1}`}</td>
                  <td className={`${styles.content} ${styles.userName}`}>
                    {smartTrim(playerScoreData.accountId ?? '', 10)}
                  </td>
                  <td className={`${styles.content} ${styles.cheddarEarned}`}>
                    {playerScoreData.cheddarEarned}
                  </td>
                  <td className={`${styles.content} ${styles.score}`}>
                    {playerScoreData.score}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {allowExpand && (
        <div className={styles.tFoot}>
          <p className={styles.showMore} onClick={handleIncreaseElementsToShow}>
            <PlusSquareIcon />
          </p>
        </div>
      )}
    </>
  );
};
