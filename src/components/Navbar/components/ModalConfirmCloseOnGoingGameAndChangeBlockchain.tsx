import { ModalContainer } from '@/components/ModalContainer';
import { localStorageSavedGameKey } from '@/constants/maze';
import { Blockchain, useGlobalContext } from '@/contexts/GlobalContext';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { callLoseGame } from '@/contracts/maze/mazeBuyerCalls';
import { Button, Text, useToast, VStack } from '@chakra-ui/react';
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

  const { selector } = useWalletSelector();

  const toast = useToast();

  async function callLoseGameIfNeeded() {
    if (blockchain === 'near') {
      try {
        const wallet = await selector.wallet();

        const response = await callLoseGame(wallet);

        toast({
          title: 'Game lost call',
          description: response,
          status: 'success',
          duration: 9000,
          position: 'bottom-right',
          isClosable: true,
        });
      } catch (err) {
        console.error('Error in gameOverLoseGame', err);
      }
    }
  }

  async function handleConfirmButton() {
    await callLoseGameIfNeeded();

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
