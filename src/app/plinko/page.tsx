'use client';
import { PlinkoGame } from '@/components/plinko/PlinkoGame';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { PlinkoContextProvider } from '@/contexts/plinko/PlinkoContextProvider';
import { ToastsContext } from '@/contexts/ToastsContext';
import styles from '@/styles/plinko-page.module.css';
import { useContext, useEffect } from 'react';

export default function Plinko() {
  const { blockchain, setBlockchain } = useGlobalContext();
  const { showToast } = useContext(ToastsContext);

  useEffect(() => {
    if (blockchain === 'base') {
      showToast(
        "Can't change nerwork",
        'error',
        'Plinko game can only be played in NEAR'
      );
    }

    setBlockchain('near');
  }, [blockchain]);

  return (
    <PlinkoContextProvider>
      <div className={styles.gameContainer}>
        <PlinkoGame isMinigame={false} />
      </div>
    </PlinkoContextProvider>
  );
}
