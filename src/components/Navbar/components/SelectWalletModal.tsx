import React from 'react';
import { ButtonConnectWallet } from './ButtonConnectWallet';
import { OnchainKitWallet } from './OnchainKitWallet';
import { ModalContainer } from '@/components/ModalContainer';
import { Button, VStack } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';

export const SelectWalletModal = () => {
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
            <Button
              bg="white"
              color="black"
              onClick={() => walletSelector.showSelectWalletModal(true)}
            >
              Login
            </Button>
          )}
        </>
      )}

      <ModalContainer
        title={'Select a wallet'}
        isOpen={walletSelector.isSelectWalletModal}
        onClose={() => walletSelector.showSelectWalletModal(false)}
      >
        <VStack spacing={4} align="center">
          {/* <DynamicWidget /> */}
          <ButtonConnectWallet
            handleButtonCLick={() =>
              walletSelector.showSelectWalletModal(false)
            }
          />
          <OnchainKitWallet
            handleCloseModal={() => walletSelector.showSelectWalletModal(false)}
          />
        </VStack>
      </ModalContainer>
    </div>
  );
};
