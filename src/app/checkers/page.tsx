'use client';

import CheckersContainer from '@/components/checkers';
import { CheckersContextProvider } from '@/contexts/checkers/CheckersContextProvider';
import { useRouter } from 'next/navigation';
import React from 'react';

function App() {
  const router = useRouter();

  router.push('/');
  return (
    <></>
    // <CheckersContextProvider>
    //   <CheckersContainer />
    // </CheckersContextProvider>
  );
}

export default App;
