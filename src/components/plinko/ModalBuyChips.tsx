import {
  FormControl,
  FormLabel,
  Button,
  useToast,
  Image,
  VStack,
  Text,
  Stack,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { useEffect, useState } from 'react';
import { buyNFT } from '@/contracts/cheddarCalls';

import styles from '@/styles/BuyNFTSection.module.css';
import { useGetCheddarNFTPrice } from '@/hooks/cheddar';
import { yton } from '@/contracts/contractUtils';
import { getTransactionLastResult } from 'near-api-js/lib/providers';
import { MintNFTLastResult } from '@/entities/interfaces';
import { getConfig } from '@/configs/config';
import { RenderCheddarIcon } from '../maze/RenderCheddarIcon';
import { RenderNearIcon } from '../maze/RenderNearIcon';
import { ModalContainer } from '../ModalContainer';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const ModalBuyChips = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selector } = useWalletSelector();
  const { data: chipPriceInCheddar, isLoading: isChipPriceInCheddarLoading } =
    useGetCheddarNFTPrice(true); //TODO call correct function
  const { data: cheddarChipPriceInNear, isLoading: isChipPriceInNearLoading } =
    useGetCheddarNFTPrice(false); //TODO call correct function
  const toast = useToast();

  //The first option is the default one
  const payingOptions = [
    {
      name: 'Cheddar',
      price: isChipPriceInCheddarLoading
        ? 'Loading'
        : yton(chipPriceInCheddar!),
      icon: <RenderCheddarIcon className={styles.tokenIcon} />,
      color: 'yellow',
    },
    {
      name: 'Near',
      price: isChipPriceInNearLoading
        ? 'Loading'
        : yton(cheddarChipPriceInNear!),
      icon: <RenderNearIcon className={styles.tokenIcon} />,
      color: 'grey',
    },
  ];

  const [tokenToPayWith, setTokenToPayWith] = useState(payingOptions[0].name);
  const [errorMsg, setErrorMsg] = useState(undefined as undefined | string);

  const modalTitle = errorMsg ? 'Something went wrong' : 'Success';

  function handleTogglePayOption() {
    if (tokenToPayWith === payingOptions[0].name) {
      setTokenToPayWith(payingOptions[1].name);
    } else {
      setTokenToPayWith(payingOptions[0].name);
    }
  }

  async function handleBuy() {
    //   try {
    //     setIsLoading(true);
    //     const wallet = await selector.wallet();
    //     const withCheddar = tokenToPayWith === 'Cheddar';
    //     const amount = withCheddar
    //       ? chipPriceInCheddar
    //       : cheddarChipPriceInNear;
    //     const resp = await buyNFT(wallet, withCheddar, amount!);
    //     const genericLastResult = await getTransactionLastResult(resp);
    //     const lastResult: MintNFTLastResult = withCheddar
    //       ? genericLastResult[1]
    //       : genericLastResult;
    //     if (lastResult.token_id) {
    //       setNftId(lastResult.token_id);
    //     }
    //     toast({
    //       title: 'Enjoy your purchase!',
    //       status: 'success',
    //       duration: 9000,
    //       position: 'bottom-right',
    //       isClosable: true,
    //     });
    //   } catch (err: any) {
    //     toast({
    //       title: err.message,
    //       status: 'error',
    //       duration: 9000,
    //       position: 'bottom-right',
    //       isClosable: true,
    //     });
    //   }
    //   setIsLoading(false);
  }

  return (
    <ModalContainer title="Buy More Chips" onClose={onClose} isOpen={isOpen}>
      <form className={styles.form}>
        <FormControl isRequired>
          <FormLabel>Amount of chips</FormLabel>
          <NumberInput size="md" maxW={24} defaultValue={3} min={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <FormLabel>Choose token to pay with:</FormLabel>
          <div className={styles.chooseTokenToPayWithContainer}>
            <span>{payingOptions[0].name}</span>
            <Switch
              colorScheme={payingOptions[0].color}
              className={styles.flip}
              size="lg"
              onChange={() => handleTogglePayOption()}
              isChecked={tokenToPayWith === payingOptions[0].name}
            />
            <span>{payingOptions[1].name}</span>
          </div>
        </FormControl>

        <FormLabel>
          {payingOptions.map((option, index) => {
            if (option.name === tokenToPayWith) {
              return (
                <div key={index}>
                  {`Cost: ${option.price}`} {option.icon}
                </div>
              );
            }
            return <></>;
          })}
        </FormLabel>
        <Button colorScheme="yellow" onClick={handleBuy} isLoading={isLoading}>
          Purchase
        </Button>
      </form>
    </ModalContainer>
  );
};
