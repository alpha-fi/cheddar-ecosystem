import { useContext, useEffect, useRef, useState } from 'react';
import styles from '@/styles/Scoreboard.module.css';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { getScoreBoard } from '@/queries/maze/api';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useGetScoreboard } from '@/hooks/maze';
import { smartTrim } from '@/utilities/exportableFunctions';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

export interface PlayerScoreData {
  accountId: string;
  score: number;
  cheddarEarned: number;
}

export const Scoreboard = () => {
  const { accountId } = useWalletSelector();
  const { data: scoreboardResponse, isLoading: isLoadingScoreboard } =
    useGetScoreboard();

  const firstLoggedUserOccurrence = useRef(-1);

  const [rowAmounts, setRowAmounts] = useState({
    daily: 4,
    weekly: 4,
    allTime: 4,
  });

  function getRowStyles(index: number, playerScoreData: PlayerScoreData) {
    let rowStyles = `${styles.rowContainer} ${index === 0 ? '' : styles.borderTop} ${accountId === playerScoreData.accountId ? styles.userBackground : ''}`;

    return rowStyles;
  }

  const Table = ({
    data,
    rowAmount,
    onIncreaseElements,
  }: {
    data: any[] | undefined;
    rowAmount: number;
    onIncreaseElements: () => void;
  }) => {
    return (
      <>
        <table className={styles.tableContainer}>
          <thead className={styles.titlesContainer}>
            <tr>
              <th className={styles.th}>#</th>
              <th className={styles.th}>User</th>
              <th className={styles.th}>
                {RenderCheddarIcon({ width: '2rem' })}
              </th>
              <th className={styles.th}>Score</th>
            </tr>
          </thead>
          <tbody className={styles.tBody}>
            {Array.isArray(data) &&
              data.map((playerScoreData, index) => {
                if (
                  firstLoggedUserOccurrence.current === -1 &&
                  playerScoreData.accountId === accountId
                ) {
                  firstLoggedUserOccurrence.current = index;
                }

                if (index >= rowAmount) return null;
                return (
                  <tr
                    key={`position-key-${index}`}
                    className={getRowStyles(index, playerScoreData)}
                  >
                    <td
                      className={`${styles.content} ${styles.position}`}
                    >{`${index + 1}`}</td>
                    <td className={`${styles.content} ${styles.userName}`}>
                      {smartTrim(playerScoreData.accountId ?? '', 12)}
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
        {Array.isArray(data) && data.length > rowAmount && (
          <div className={styles.tFoot}>
            <p className={styles.showMore} onClick={onIncreaseElements}>
              <PlusSquareIcon />
            </p>
          </div>
        )}
      </>
    );
  };

  const CustomTab: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Tab
      _selected={{
        color: '#ECC94B',
        borderBottomColor: '#ECC94B',
        fontWeight: 600,
      }}
    >
      {children}
    </Tab>
  );

  return (
    <>
      <Tabs color="customYellow">
        <TabList>
          <CustomTab>Daily</CustomTab>
          <CustomTab>Weekly</CustomTab>
          <CustomTab>All time</CustomTab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table
              data={scoreboardResponse?.scoreboard.daily}
              rowAmount={rowAmounts.daily}
              onIncreaseElements={() =>
                setRowAmounts((prev) => ({ ...prev, daily: prev.daily + 5 }))
              }
            />
          </TabPanel>
          <TabPanel>
            <Table
              data={scoreboardResponse?.scoreboard.weekly}
              rowAmount={rowAmounts.weekly}
              onIncreaseElements={() =>
                setRowAmounts((prev) => ({ ...prev, weekly: prev.weekly + 5 }))
              }
            />
          </TabPanel>
          <TabPanel>
            <Table
              data={scoreboardResponse?.scoreboard.allTime}
              rowAmount={rowAmounts.allTime}
              onIncreaseElements={() =>
                setRowAmounts((prev) => ({
                  ...prev,
                  allTime: prev.allTime + 5,
                }))
              }
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
