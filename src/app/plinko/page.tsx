'use client';
import { PlinkoBoard } from '@/components/plinko/PlinkoGameboard';
import React from 'react';
import styles from '@/styles/plinko-page.module.css';
import { PlinkoContextProvider } from '@/contexts/plinko/PlinkoContextProvider';
import { PlinkoGame } from '@/components/plinko/PlinkoGame';

export default function Plinko() {
  return (
    <div className={styles.gameContainer}>
      <PlinkoGame isMinigame={false} />
    </div>
  );
}
