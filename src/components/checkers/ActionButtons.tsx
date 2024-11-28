import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { Button, HStack } from '@chakra-ui/react';
import React, { useContext } from 'react';

export const ActionButtons = () => {
  const {
    setIsCheckedDoubleJump,
    isCheckedDoubleJump,
    moveBuffer,
    handleCancelMultiMove,
  } = useContext(CheckersContext);
  return (
    <HStack justifyContent="center">
      <div
        className="double-jump-button-container"
        style={{ textAlign: 'center' }}
      >
        <input
          type="checkbox"
          id="near-game-double-move"
          onClick={(e: any) => setIsCheckedDoubleJump(e.target.checked)}
          checked={isCheckedDoubleJump}
        />
        <label htmlFor="near-game-double-move">Double jump</label>
      </div>
      {moveBuffer && (
        <Button colorScheme="purple" onClick={handleCancelMultiMove} h="34px">
          Cancel move
        </Button>
      )}
    </HStack>
  );
};
