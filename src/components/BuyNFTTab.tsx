import { getConfig } from '@/configs/config';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { yton } from '@/contracts/contractUtils';
import { useGetCheddarNFTPrice } from '@/hooks/cheddar';
import {
  FormControl,
  FormLabel,
  Button,
  Image,
  VStack,
  Text,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RenderCheddarIcon } from './maze/RenderCheddarIcon';
import { RenderNearIcon } from './maze/RenderNearIcon';

import styles from '@/styles/BuyNFTSection.module.css';

import { getTransactionLastResult } from 'near-api-js/lib/providers';
import { buyNFT } from '@/contracts/cheddarCalls';
import { MintNFTLastResult } from '@/entities/interfaces';

interface Props {
  isOpen: boolean;
}

export const BuyNFTTab = ({ isOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { selector } = useWalletSelector();

  const { nftImageBaseUrl } = getConfig().networkData;
  const [nftId, setNftId] = useState('');
  const [showNftImage, setShowNftImage] = useState(true);

  const toast = useToast();

  const {
    data: cheddarNftPriceInCheddar,
    isLoading: isNftPriceInCheddarLoading,
  } = useGetCheddarNFTPrice(true);
  const { data: cheddarNftPriceInNear, isLoading: isNftPriceInNearLoading } =
    useGetCheddarNFTPrice(false);

  //The first option is the default one
  const payingOptions = [
    {
      name: 'Cheddar',
      price: isNftPriceInCheddarLoading
        ? 'Loading'
        : yton(cheddarNftPriceInCheddar!),
      icon: <RenderCheddarIcon className={styles.tokenIcon} />,
      color: 'yellow',
    },
    {
      name: 'Near',
      price: isNftPriceInNearLoading ? 'Loading' : yton(cheddarNftPriceInNear!),
      icon: <RenderNearIcon className={styles.tokenIcon} />,
      color: 'grey',
    },
  ];

  const [tokenToPayWith, setTokenToPayWith] = useState(payingOptions[0].name);
  const [errorMsg, setErrorMsg] = useState(undefined as undefined | string);

  function handleTogglePayOption() {
    if (tokenToPayWith === payingOptions[0].name) {
      setTokenToPayWith(payingOptions[1].name);
    } else {
      setTokenToPayWith(payingOptions[0].name);
    }
  }

  async function handleBuyNFT() {
    try {
      setIsLoading(true);
      const wallet = await selector.wallet();

      const withCheddar = tokenToPayWith === 'Cheddar';
      const amount = withCheddar
        ? cheddarNftPriceInCheddar
        : cheddarNftPriceInNear;
      const resp = await buyNFT(wallet, withCheddar, amount!);
      const genericLastResult = await getTransactionLastResult(resp);
      const lastResult: MintNFTLastResult = withCheddar
        ? genericLastResult[1]
        : genericLastResult;
      if (lastResult.token_id) {
        setNftId(lastResult.token_id);
      }
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
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isOpen) {
      setNftId('');
      setShowNftImage(true);
    }
  }, [isOpen]);

  return (
    <>
      {nftId ? (
        <VStack>
          <Text>NFT Minted Succesfully!</Text>
          {showNftImage && (
            <Image
              onError={() => setShowNftImage(false)}
              src={`${nftImageBaseUrl}${nftId}.png`}
              alt={`chedar nft ${nftId}`}
            />
          )}
        </VStack>
      ) : (
        <form className={styles.form}>
          <FormControl isRequired>
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
                  <div key={`payingOption-${index}`}>
                    {`Cost: ${option.price}`} {option.icon}
                  </div>
                );
              }
              return <div key={`payingOption-${index}`}></div>;
            })}
          </FormLabel>
          <Button
            colorScheme="yellow"
            onClick={handleBuyNFT}
            isLoading={isLoading}
          >
            Purchase
          </Button>
        </form>
      )}
    </>
  );
};
