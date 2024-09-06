'use client';
import { PlinkoBoard } from '@/components/plinko/PlinkoGameboard';
import React from 'react';
import styles from '@/styles/plinko-page.module.css';

export default function PlinkoGame() {
  return (
    <div className={styles.gameContainer}>
      <PlinkoBoard isMinigame={false} />
    </div>
  );
}
