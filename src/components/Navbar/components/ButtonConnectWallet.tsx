import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { yton } from '@/contracts/contractUtils';
import Link from 'next/link';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import { smartTrim } from '@/utilities/exportableFunctions';
import { useGetCheddarBalance } from '@/hooks/cheddar';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useEffect } from 'react';

type Props = {
  handleButtonCLick?: () => void;
  text?: string;
};

export function ButtonConnectWallet({ handleButtonCLick, text }: Props) {
  const walletSelector = useWalletSelector();
  const { connect, isSuccess } = useConnect();
  const { address } = useAccount();
  const { disconnect: disconnectBase } = useDisconnect();

  const { data: cheddarBalanceData, isLoading: isLoadingCheddarBalance } =
    useGetCheddarBalance();

  const handleOnClick = async () => {
    if (
      walletSelector.selector.isSignedIn() &&
      walletSelector.selector.wallet
    ) {
      const wallet = await walletSelector.selector.wallet();
      wallet.signOut();
    } else {
      walletSelector.modal.show();
    }
  };

  useEffect(() => {
    const handleLogin = async () => {
      if (address) {
        console.log('Base Wallet Connected:', isSuccess);
        await handleOnClick(); // Attempt to log in to NEAR
      } else {
        console.log('NEAR Wallet Connected, Disconnecting Base');
        disconnectBase(); // Disconnect from Base only if NEAR is logged in
      }
    };

    handleLogin();
  }, [isSuccess, walletSelector, address, disconnectBase]);

  const handleSwitchToBase = () => {
    // Ensure this is triggered directly by user interaction
    connect({ connector: coinbaseWallet() });
  };

  return (
    <>
      {walletSelector.selector.isSignedIn() ? (
        <Menu>
          <MenuButton
            px={{ base: 2, md: 3 }}
            py={{ base: 1, md: 4 }}
            fontSize={{ base: 14, md: 16 }}
            colorScheme="yellow"
            bgColor="yellowCheddar"
            border="1px solid #3334"
            as={Button}
            borderRadius="full"
            rightIcon={<ChevronDownIcon />}
          >
            <Text mr="5px" display="inline-block">
              {isLoadingCheddarBalance ? (
                <Spinner size="sm" />
              ) : (
                yton(`${cheddarBalanceData}`)
              )}
            </Text>
            <RenderCheddarIcon />
          </MenuButton>
          <MenuList
            minWidth="auto"
            p="0"
            borderRadius="full"
            bg="yellowCheddar"
          >
            <MenuItem>
              <Link
                href={`https://nearblocks.io/address/${walletSelector.accountId}`}
                target="_blank"
              >
                {smartTrim(walletSelector.accountId ?? '', 12)}
              </Link>
            </MenuItem>
            {/* Trigger switch to Base with user interaction */}
            <MenuItem onClick={handleSwitchToBase}>Switch to Base</MenuItem>
            <MenuItem onClick={handleOnClick}>Log out</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          onClick={() => {
            handleOnClick();
            if (handleButtonCLick) handleButtonCLick();
          }}
          bg="black"
          color="white"
          _hover={{
            bg: 'gray.700',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)',
          }}
        >
          {text ? text : 'Login Near'}
        </Button>
      )}
    </>
  );
}
