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
import { yton } from '@/contracts/contractUtils';
import Link from 'next/link';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import { smartTrim } from '@/utilities/exportableFunctions';

import { useGlobalContext } from '@/contexts/GlobalContext';

export function WalletMenu() {
  const {
    blockchain,
    selectedBlockchainAddress,
    showConnectionModal,
    disconnectWallet,
    cheddarBalance,
    isCheddarBalanceLoading,
    isConnected,
    isUserVerified,
  } = useGlobalContext()

  return (
    <>
      {isConnected ? (
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
              {isCheddarBalanceLoading ? (
                <Spinner size="sm" />
              ) : (
                yton(`${cheddarBalance}`)
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
                  isUserVerified
                    ? 'https://ipfs.near.social/ipfs/bafkreigxe4ludhipu2j46jt57iuyufkbnwkuhjixocguwjdcktfsxekghu'
                    : 'https://ipfs.near.social/ipfs/bafkreieq4222tf3hkbccfnbw5kpgedm3bf2zcfgzbnmismxav2phqdwd7q'
                }
              />
              <Link
                href={blockchain==="near"?`https://nearblocks.io/address/${selectedBlockchainAddress}`:"https://keys.coinbase.com"}
                target="_blank"
              >
                {smartTrim(selectedBlockchainAddress ?? '', 12)}
              </Link>
            </MenuItem>
            <MenuItem onClick={disconnectWallet}>Log out</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          onClick={showConnectionModal}
          bg="black"
          color="white"
          _hover={{
            bg: 'gray.700',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)',
          }}
        >
          Login
        </Button>
      )}
    </>
  );
}
