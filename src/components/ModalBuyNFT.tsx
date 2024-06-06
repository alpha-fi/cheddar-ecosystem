import { FormControl, FormLabel, Button, useToast } from '@chakra-ui/react';
import { ModalContainer } from './FeedbackModal';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { RadioButtonBroup } from './RadioButtonGroup';
import { useState } from 'react';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { RenderNearIcon } from './RenderNearIcon';
import { buyNFT } from '@/contracts/cheddarCalls';

import styles from '../styles/BuyNFTSection.module.css';
import { useGetCheddarNFTPrice } from '@/hooks/cheddar';
import { yton } from '@/contracts/contractUtils';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const ModalBuyNFT = ({ isOpen, onClose }: Props) => {
  const { selector } = useWalletSelector();
  const {
    data: cheddarNftPriceInCheddar,
    isLoading: isNftPriceInCheddarLoading,
  } = useGetCheddarNFTPrice(true);
  const { data: cheddarNftPriceInNear, isLoading: isNftPriceInNearLoading } =
    useGetCheddarNFTPrice(false);
  const toast = useToast();

  //The first option is the default one
  const payingOptions = [
    {
      name: 'Cheddar',
      price: isNftPriceInCheddarLoading
        ? 'Loading'
        : yton(cheddarNftPriceInCheddar!),
      icon: <RenderCheddarIcon className={styles.tokenIcon} />,
    },
    {
      name: 'Near',
      price: isNftPriceInNearLoading ? 'Loading' : yton(cheddarNftPriceInNear!),
      icon: <RenderNearIcon className={styles.tokenIcon} />,
    },
  ];

  const [tokenToPayWith, setTokenToPayWith] = useState(payingOptions[0].name);
  const [errorMsg, setErrorMsg] = useState(undefined as undefined | string);

  const modalTitle = errorMsg ? 'Something went wrong' : 'Success';

  async function handlePurchase() {
    try {
      const wallet = await selector.wallet();
      const withCheddar = tokenToPayWith === 'Cheddar';
      const amount = withCheddar
        ? cheddarNftPriceInCheddar
        : cheddarNftPriceInNear;
      await buyNFT(wallet, withCheddar, amount!);
      toast({
        title: 'Enjoy your purchase!',
        status: 'success',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: err.message,
        status: 'error',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }

  return (
    <ModalContainer title="Buy Cheddar NFT" onClose={onClose} isOpen={isOpen}>
      <form className={styles.form}>
        <FormControl isRequired>
          <FormLabel>Choose token to pay with:</FormLabel>
          <RadioButtonBroup
            options={payingOptions}
            optionSelected={tokenToPayWith}
            setOptionSelected={setTokenToPayWith}
          />
        </FormControl>

        <FormLabel>
          {payingOptions.map((option) => {
            if (option.name === tokenToPayWith) {
              return (
                <>
                  {`Cost: ${option.price}`} {option.icon}
                </>
              );
            }
            return <></>;
          })}
        </FormLabel>
        <Button colorScheme="yellow" onClick={handlePurchase}>
          Purchase
        </Button>
      </form>
    </ModalContainer>
  );
};
