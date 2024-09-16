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
import { YellowButton } from './YellowButton';
import { yton } from '@/contracts/contractUtils';
import Link from 'next/link';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import { smartTrim } from '@/utilities/exportableFunctions';
import { useGetCheddarBalance } from '@/hooks/cheddar';
type Props = {
  handleOnCLick: () => void;
};

export function ButtonConnectWallet({ handleOnCLick }: Props) {
  const walletSelector = useWalletSelector();
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
            <MenuItem onClick={handleOnClick}>Log out</MenuItem>
          </MenuList>
        </Menu>
      ) : (
<Button 
  onClick={() => {
    handleOnClick()
    handleOnCLick()
  }
  } 
  bg="white" 
  color="black" 
  _hover={{ bg: "gray.100" }}
>
  Login NEAR
</Button>
      )}
    </>
  );
}
