import React from 'react';
import { ButtonConnectWallet } from './ButtonConnectWallet';
import { OnchainKitWallet } from './OnchainKitWallet';
import { ModalContainer } from '@/components/ModalContainer';
import { Button, VStack } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';

export const SelectWalletModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const closeModal = () => setIsOpen(false);
  const { address } = useAccount();
  const walletSelector = useWalletSelector();

  return (
    <div>
      {walletSelector.selector.isSignedIn() ? (
        <ButtonConnectWallet />
      ) : (
        <>
          {address ? (
            <OnchainKitWallet />
          ) : (
            <Button bg="white" color="black" onClick={() => setIsOpen(true)}>
              Login
            </Button>
          )}
        </>
      )}

      <ModalContainer
        title={'Select a wallet'}
        isOpen={isOpen}
        onClose={closeModal}
      >
        <VStack spacing={4} align="center">
          {/* <DynamicWidget /> */}
          <ButtonConnectWallet handleButtonCLick={closeModal} />
          <OnchainKitWallet handleCloseModal={closeModal} />
        </VStack>
      </ModalContainer>
    </div>
  );
};
