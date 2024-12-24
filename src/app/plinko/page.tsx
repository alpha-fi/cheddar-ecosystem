'use client';
import { PlinkoBoard } from '@/components/plinko/PlinkoGameboard';
import React, { useEffect } from 'react';
import styles from '@/styles/plinko-page.module.css';
import { PlinkoContextProvider } from '@/contexts/plinko/PlinkoContextProvider';
import { PlinkoGame } from '@/components/plinko/PlinkoGame';
import { useGlobalContext } from '@/contexts/GlobalContext';

export default function Plinko() {

  const { blockchain ,setBlockchain } = useGlobalContext()

  useEffect(() => {
    setBlockchain('near')
  }, [blockchain])
  

  return (
    <PlinkoContextProvider>

    <div className={styles.gameContainer}>
      <PlinkoGame isMinigame={false} />
    </div>
    </PlinkoContextProvider>
  );
}
