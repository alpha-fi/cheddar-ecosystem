'use client';

import React, { useContext } from 'react';
import { Stack } from '@chakra-ui/react';
import { ModalContainer } from '@/components/ModalContainer';
import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { RulesModal } from './RulesModal';
import { CheckersInfo } from './CheckersInfo';
import { GameStatistics } from './GameStatistics';
import { OnlyAfterLogIn } from './OnlyAfterLogIn';
import { CheckersGameboard } from './CheckersGameboard';

export default function CheckersContainer() {
  const { gameData, error, setError } = useContext(CheckersContext);

  return (
    <>
      <RulesModal />
      <Stack
        direction={{ base: gameData ? 'column-reverse' : 'column', lg: 'row' }}
      >
        <div className="column" style={{ minHeight: 0, paddingBottom: '30px' }}>
          <CheckersInfo />
          <GameStatistics />
          <OnlyAfterLogIn />
        </div>

        <CheckersGameboard />
      </Stack>
      <ModalContainer
        title="Error"
        isOpen={error !== ''}
        onClose={() => setError('')}
      >
        {error}
      </ModalContainer>
    </>
  );
}
