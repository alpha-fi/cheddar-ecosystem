import styles from '@/styles/BuyMatchTab.module.css';

import {
  Button,
  Flex,
  Input,
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

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (options && firstLoad) {
      setFirstLoad(false);
      setAmountToBuy(Math.round((options[0].amount + options[1].amount) / 2));
    }
  }, [options]);

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

    return `Total prize: ${option ? amountToBuy * option.value : 0}`;
  }

  function handleBuyMatchs() {
    //TODO add real functionallity
    setIsLoading(true);
  }

  return (
    <div>
      <Flex className={styles.generalContainer} align={'center'}>
        <InfoOutlineIcon
          height={'30px'}
          width={'30px'}
          padding={'0.5rem'}
          backgroundColor={'white'}
          color={'black'}
          borderRadius={'100%'}
        />
        <Flex direction={'column'} marginLeft={'1rem'} color={'black'}>
          <span className={styles.discountsTitle}>
            Discounts for buying more games!
          </span>
          {isOptionsLoading ? (
            <Spinner />
          ) : (
            options.map((option: any, index: number) => {
              if (index > 0) {
                return (
                  <>
                    <span>
                      + {option.amount} games = {option.value}{' '}
                      <RenderCheddarIcon className={styles.cheddarIcon} /> each
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
        <Input value={getTotalPrize()} className={styles.totalPrizeInput} />
        <RenderCheddarIcon />
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
