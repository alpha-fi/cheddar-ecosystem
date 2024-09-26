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

  function getRowStyles(index: number, playerScoreData: PlayerScoreData) {
    let rowStyles = `${styles.rowContainer} ${index === 0 ? '' : styles.borderTop} ${accountId === playerScoreData.accountId ? styles.userBackground : ''}`;

    return rowStyles;
  }

  const Table = ({ data }: { data: any[] | undefined }) => {
    const [rowAmount, setRowAmount] = useState(4);

    function handleIncreaseElementsToShow() {
      setRowAmount(rowAmount + 5);
    }

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
            <p
              className={styles.showMore}
              onClick={handleIncreaseElementsToShow}
            >
              <PlusSquareIcon />
            </p>
          </div>
        )}
      </>
    );
  };

  interface CustomTabProps {
    children: React.ReactNode;
  }

  const CustomTab: React.FC<CustomTabProps> = ({ children }) => {
    return (
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
  };

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
            <Table data={scoreboardResponse?.scoreboard.daily} />
          </TabPanel>
          <TabPanel>
            <Table data={scoreboardResponse?.scoreboard.weekly} />
          </TabPanel>
          <TabPanel>
            <Table data={scoreboardResponse?.scoreboard.allTime} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
