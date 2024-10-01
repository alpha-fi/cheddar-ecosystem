import {
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Address, Name, Identity } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { ButtonConnectWallet } from './ButtonConnectWallet';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAccount, useConnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { yton } from '@/contracts/contractUtils';
import { useGetCheddarBaseBalance } from '@/hooks/cheddar';
import { formatUnits } from 'viem';
type Props = {
  handleCloseModal?: () => void;
};
export function OnchainKitWallet({ handleCloseModal }: Props) {
  const { address } = useAccount();
  const { connect } = useConnect();
  const { data: cheddarBaseBalance, isLoading } = useGetCheddarBaseBalance();
  console.log(cheddarBaseBalance);
  return (
    <div className="flex justify-end">
      {address ? (
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
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                Number(cheddarBaseBalance as bigint)
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
              <Identity address={address} hasCopyAddressOnClick>
                <Name />
                <Address className={color.foregroundMuted} />
              </Identity>
            </MenuItem>
            <MenuItem>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
              >
                Wallet
              </WalletDropdownLink>
            </MenuItem>
            <MenuItem>
              <ButtonConnectWallet text="Switch to Near" />
            </MenuItem>
            <MenuItem>
              <WalletDropdownDisconnect />
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          onClick={() => {
            connect({ connector: coinbaseWallet() });
            if (handleCloseModal) handleCloseModal();
          }}
          bg="blue"
          color="white"
          _hover={{ bg: 'blue.600', transform: 'scale(1.05)' }}
        >
          Login Base
        </Button>
      )}
    </div>
  );
}
