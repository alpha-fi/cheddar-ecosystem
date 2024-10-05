'use client';

import CheckersContainer from '@/components/checkers';
import { CheckersContextProvider } from '@/contexts/checkers/CheckersContextProvider';
import React from 'react';

function App() {
  return (
    <CheckersContextProvider>
      <CheckersContainer />
    </CheckersContextProvider>
  );
}

export default App;
