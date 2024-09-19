'use client';

import MazeContainer from '@/components/maze';
import { GameContextProvider } from '@/contexts/maze/GameContextProvider';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import MintCheddar from '@/components/MintCheddar';

export default function Maze() {
  return (
    <GameContextProvider>
      <MazeContainer />
      <DynamicWidget />
      <MintCheddar />
    </GameContextProvider>
  );
}
