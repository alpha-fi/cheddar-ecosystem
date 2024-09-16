import React from 'react';
import { ButtonConnectWallet } from './ButtonConnectWallet';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { OnchainKitWallet } from './OnchainKitWallet';
import { ModalContainer } from '@/components/ModalContainer';
import { Button, VStack } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

export const SelectWalletModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const closeModal = () => setIsOpen(false);
  const { address } = useAccount();
  return (
    <div>
      <Button bg="white" color="black" onClick={() => setIsOpen(true)}>
        {address ? <span>Login</span> : <span>Login</span>}
      </Button>
      <ModalContainer
        title={'Select a wallet'}
        isOpen={isOpen}
        onClose={closeModal}
      >
        <VStack spacing={4} align="center">
          {/* <DynamicWidget /> */}
          <ButtonConnectWallet handleOnCLick={closeModal} />
          <OnchainKitWallet />
        </VStack>
      </ModalContainer>
    </div>
  );
};
