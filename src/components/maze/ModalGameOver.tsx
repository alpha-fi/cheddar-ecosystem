import { useDisclosure } from '@chakra-ui/react';
import { ModalContainer } from '../ModalContainer';
import { GameOverModalContent } from './GameOverModalContent';
import { DoorsGameboard } from '../doors/DoorsGameboard';
import { useContext, useEffect, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { CHOOSE_DOORS_MESSAGE, DOORS_MINIGAME_MESSAGE } from '@/constants/maze';

export const ModalGameOver = () => {
  const {
    saveResponse,
    isDoorsGameOpened,
    gameOverMessage,
    setGameOverMessage,
    gameOver,
    hasPlayedDoorsMinigame,
  } = useContext(GameContext);

  const [caseName, setCaseName] = useState<'doors' | 'gameOver'>('doors');

  const {
    isOpen: isGameOverOpened,
    onOpen: onOpenGameOver,
    onClose: onCloseGameOver,
  } = useDisclosure();
  const {
    isOpen: isShowErrorOpened,
    onOpen: onOpenShowError,
    onClose: onCloseShowError,
  } = useDisclosure();

  function closeGameOverModal() {
    setGameOverMessage('');
    onCloseGameOver();
  }

  const options = {
    gameOver: {
      onOpenFunction: onOpenGameOver,
      onCloseFunction: closeGameOverModal,
      neverCloseOnOverlayClick: true,
      hideActionButtons: false,
      hideCloseButton: false,
    },
    doors: {
      onOpenFunction: onOpenGameOver,
      onCloseFunction: () => {},
      neverCloseOnOverlayClick: true,
      hideActionButtons: true,
      hideCloseButton: true,
    },
  };

  useEffect(() => {
    setCaseName(
      isDoorsGameOpened && !hasPlayedDoorsMinigame ? 'doors' : 'gameOver'
    );
  }, [isDoorsGameOpened, gameOverMessage]);

  useEffect(() => {
    if (gameOverMessage !== '') {
      if (caseName === 'gameOver') {
        onOpenGameOver()
        gameOver();
      } else {
        onOpenGameOver();
      }
    }
  }, [caseName, gameOverMessage]);

  useEffect(() => {
    if (saveResponse) {
      onOpenShowError();
    }
  }, [saveResponse]);

  return (
    <>
      <ModalContainer
        title={isDoorsGameOpened && !hasPlayedDoorsMinigame ? "Choose a door" : "Game Over"}
        isOpen={isGameOverOpened}
        onClose={options[caseName].onCloseFunction}
        neverCloseOnOverlayClick={options[caseName].neverCloseOnOverlayClick}
        hideActionButtons={options[caseName].hideActionButtons}
        hideCloseButton={options[caseName].hideCloseButton}
      >
        <GameOverModalContent
          showDoorsGameboard={isDoorsGameOpened || hasPlayedDoorsMinigame}
        />
      </ModalContainer>

      <ModalContainer
        title={'Error saving game'}
        isOpen={isShowErrorOpened}
        onClose={onCloseShowError}
      >
        <div>
          {saveResponse &&
            saveResponse.map((error, index) => {
              return <div key={index}>{error}</div>;
            })}
        </div>
      </ModalContainer>
    </>
  );
};
