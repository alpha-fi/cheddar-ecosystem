import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { YellowButton } from './YellowButton';
import { yton } from '@/contracts/contractUtils';
import Link from 'next/link';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import { smartTrim } from '@/utilities/exportableFunctions';
import { useGetCheddarBalance } from '@/hooks/cheddar';
import { useContext, useEffect, useState } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useAccount } from 'wagmi';
import { useConnect } from 'wagmi';
import { useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

type Props = {
  handleButtonCLick?: () => void;
  text?: string;
};

export function ButtonConnectWallet({ handleButtonCLick, text }: Props) {
  const walletSelector = useWalletSelector();
  const { connect: connectBase } = useConnect();
  const { address } = useAccount();
  const { disconnect: disconnectBase } = useDisconnect();

  const { data: cheddarBalanceData, isLoading: isLoadingCheddarBalance } =
    useGetCheddarBalance();

  const { isUserNadabotVerfied, isUserHolonymVerified } =
    useContext(GameContext);
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

  // Detect when user logs in or out from Base
  useEffect(() => {
    if (address && walletSelector.selector.isSignedIn()) {
      // User is logged into NEAR, disconnect from Base
      disconnectBase();
    } else if (!walletSelector.selector.isSignedIn() && !address) {
      // connectBase({
      //   connector: coinbaseWallet(),
      // });
    }
  }, [address, walletSelector, walletSelector.accounts]);

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
            <MenuItem display="flex" gap={1}>
              <Img
                style={{ height: 20 }}
                src={
                  isUserNadabotVerfied || isUserHolonymVerified
                    ? 'https://ipfs.near.social/ipfs/bafkreigxe4ludhipu2j46jt57iuyufkbnwkuhjixocguwjdcktfsxekghu'
                    : 'https://ipfs.near.social/ipfs/bafkreieq4222tf3hkbccfnbw5kpgedm3bf2zcfgzbnmismxav2phqdwd7q'
                }
              />
              <Link
                href={`https://nearblocks.io/address/${walletSelector.accountId}`}
                target="_blank"
              >
                {smartTrim(walletSelector.accountId ?? '', 12)}
              </Link>
            </MenuItem>
            {/* <MenuItem onClick={handleOnClick}>Switch to Base</MenuItem> */}

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
