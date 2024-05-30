import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { YellowButton } from './YellowButton';

export function ButtonConnectWallet() {
  const walletSelector = useWalletSelector();

  function smartTrim(string: string, maxLength: number) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength == 1) return string.substring(0, 1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxLength;
    var lstrip = Math.ceil(toremove / 2);
    var rstrip = toremove - lstrip;
    return (
      string.substring(0, midpoint - lstrip) +
      '...' +
      string.substring(midpoint + rstrip)
    );
  }

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
            colorScheme="yellow"
            bgColor="yellowCheddar"
            border="1px solid #3334"
            as={Button}
            borderRadius="full"
            rightIcon={<ChevronDownIcon />}
          >
            {smartTrim(walletSelector.accountId ?? '', 10)}
          </MenuButton>
          <MenuList
            minWidth="auto"
            p="0"
            borderRadius="full"
            bg="yellowCheddar"
          >
            <Button
              onClick={handleOnClick}
              colorScheme="yellow"
              borderRadius="full"
              _focus={{
                boxShadow: '0 0 0 0 #0000',
              }}
            >
              Disconnect
            </Button>
          </MenuList>
        </Menu>
      ) : (
        <YellowButton onClick={handleOnClick}>Login</YellowButton>
      )}
    </>
  );
}
