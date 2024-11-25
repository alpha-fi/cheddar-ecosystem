import styles from '@/styles/BuyMatchTab.module.css';

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
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { RenderCheddarIcon } from './maze/RenderCheddarIcon';
import { useEffect, useState } from 'react';
import { useGetCheddarMazeMatchPrice } from '@/hooks/cheddar';

interface Props {}

export const BuyMatchTab = ({}: Props) => {
  const { data: options, isLoading: isOptionsLoading } =
    useGetCheddarMazeMatchPrice(true);

  const [amountToBuy, setAmountToBuy] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);

  function getOptionStyles(index: number) {
    return `${styles.option} ${index !== 0 && styles.borderLeft}`;
  }

  function getTotalPrize() {
    const option =
      options &&
      options
        .slice()
        .reverse()
        .find(
          (o: any /*Change type to propper one*/) => amountToBuy >= o.amount
        );

    return `${option ? (amountToBuy * option.value).toFixed(1) : 0}`;
  }

  function handleBuyMatchs() {
    //TODO add real functionallity
    setIsLoading(true);
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
            options.map((option: any, index: number) => {
              if (index > 0) {
                return (
                  <>
                    <span>
                      + {option.amount} games = {option.value}{' '}
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
            options.map((option: any, index: number) => {
              return (
                <span
                  key={`buy-match-option-selector-${index}`}
                  className={getOptionStyles(index)}
                  onClick={() => setAmountToBuy(Number(option.amount))}
                >
                  {option.amount}
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
            value={getTotalPrize()}
          />
          <InputRightElement>
            <RenderCheddarIcon />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Button
        className={styles.purchaseButton}
        colorScheme="yellow"
        onClick={handleBuyMatchs}
        isLoading={isLoading}
      >
        Purchase
      </Button>
    </div>
  );
};
