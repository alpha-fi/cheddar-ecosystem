import styles from '@/styles/BuyMatchTab.module.css';

import { getConfig } from '@/configs/config';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { yton } from '@/contracts/contractUtils';
import { ftTransferCall } from '@/contracts/tokenCheddarCalls';
import { useGetCheddarMazeMatchPrices } from '@/hooks/maze';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { RenderCheddarIcon } from './maze/RenderCheddarIcon';

interface Props {}

export const BuyMatchTab = ({}: Props) => {
  const { data: options, isLoading: isOptionsLoading } =
    useGetCheddarMazeMatchPrices();

  const toast = useToast();

  const { blockchain } = useGlobalContext();

  const { selector } = useWalletSelector();

  const [amountToBuy, setAmountToBuy] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);

  function getOptionStyles(index: number) {
    return `${styles.option} ${index !== 0 && styles.borderLeft}`;
  }

  function getTotalPrice() {
    const option =
      options &&
      options
        .slice()
        .reverse()
        .find((o: any /*Change type to propper one*/) => amountToBuy >= o[0]);

    return `${option ? (amountToBuy * yton(option[1])).toFixed(1) : 0}`;
  }

  async function handleBuyMatches() {
    if (blockchain !== 'near') return;

    try {
      setIsLoading(true);
      const wallet = await selector.wallet();
      const amount = getTotalPrice();

      const mazeBuyerContract = getConfig().contracts.near.mazeBuyer;
      const cheddarContract = getConfig().contracts.near.cheddarToken;

      const response = await ftTransferCall(
        wallet,
        cheddarContract,
        mazeBuyerContract,
        Number(amount)
      );

      if (yton(response) >= 0) {
        toast({
          title: 'Successful purchase',
          status: 'success',
          duration: 9000,
          position: 'bottom-right',
          isClosable: true,
        });
      }
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

  return (
    <div>
      <Flex className={styles.generalContainer} align={'center'}>
        <InfoOutlineIcon height={'20px'} width={'20px'} color={'white'} />
        <Flex direction={'column'} marginLeft={'1rem'} color={'white'}>
          <span className={styles.discountsTitle}>Game discounts!</span>
          {isOptionsLoading ? (
            <Spinner />
          ) : (
            options &&
            options.map((option: any, index: number) => {
              if (index > 0) {
                return (
                  <>
                    <span>
                      + {option[0]} games = {yton(option[1])}{' '}
                      <RenderCheddarIcon /> each
                    </span>
                  </>
                );
              } else {
                return <></>;
              }
            })
          )}
        </Flex>
      </Flex>
      <Flex className={styles.selectAmountContainer}>
        <Flex className={styles.amountOptionsSelector}>
          {isOptionsLoading ? (
            <Spinner />
          ) : (
            options &&
            options.map((option: any, index: number) => {
              return (
                <span
                  key={`buy-match-option-selector-${index}`}
                  className={getOptionStyles(index)}
                  onClick={() => setAmountToBuy(Number(option[0]))}
                >
                  {option[0]}
                </span>
              );
            })
          )}
        </Flex>
        <NumberInput
          width={'70px'}
          defaultValue={1}
          value={amountToBuy}
          onChange={(e) => setAmountToBuy(Number(e))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Flex className={styles.totalPrizeContainer}>
        <InputGroup className={styles.totalPrizeInput}>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
            width={'max-content'}
            marginLeft={'1rem'}
          >
            Total price
          </InputLeftElement>
          <Input
            textAlign={'end'}
            disabled
            _disabled={{
              cursor: 'default',
            }}
            value={getTotalPrice()}
          />
          <InputRightElement>
            <RenderCheddarIcon />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Button
        className={styles.purchaseButton}
        colorScheme="yellow"
        onClick={handleBuyMatches}
        isLoading={isLoading}
      >
        Purchase
      </Button>
    </div>
  );
};
