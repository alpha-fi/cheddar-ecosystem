import { ModalContainer } from '@/components/ModalContainer';
import { localStorageSavedGameKey } from '@/constants/maze';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { Button, Text, VStack } from '@chakra-ui/react';
import { useContext } from 'react';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const ModalConfirmCloseOnGoingGameAndChangeBlockchain = ({
  isOpen,
  onClose,
}: Props) => {
  const { blockchain, setBlockchain } = useGlobalContext();
  const {
    setTimerStarted,
    setGameOverFlag,
    setRemainingTime,
    timeLimitInSeconds,
  } = useContext(GameContext);

  async function handleConfirmButton() {
    localStorage.removeItem(localStorageSavedGameKey);

    setTimerStarted(false);
    setGameOverFlag(true);
    setRemainingTime(timeLimitInSeconds);

    setBlockchain(blockchain === 'near' ? 'base' : 'near');
    onClose();
  }

  return (
    <ModalContainer title="Are you sure?" onClose={onClose} isOpen={isOpen}>
      <VStack>
        <Text>
          If you confirm you'll end your current maze game and lost progress.
        </Text>
        <Button colorScheme="yellow" onClick={handleConfirmButton} mt={'1rem'}>
          Confirm
        </Button>
      </VStack>
    </ModalContainer>
  );
};
