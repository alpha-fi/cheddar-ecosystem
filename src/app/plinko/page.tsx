'use client';
import { PlinkoBoard } from '@/components/plinko/PlinkoGameboard';
import React from 'react';
import styles from '@/styles/plinko-page.module.css';
import { PlinkoContextProvider } from '@/contexts/plinko/PlinkoContextProvider';

export default function PlinkoGame() {
  return (
    <PlinkoContextProvider>

    <div className={styles.gameContainer}>
      <PlinkoBoard isMinigame={false} />
    </div>
    </PlinkoContextProvider>
  );
}
