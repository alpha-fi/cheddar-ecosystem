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
  Stack,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { RenderCheddarIcon } from './maze/RenderCheddarIcon';
import { useState } from 'react';

interface Props {}

export const BuyMatchTab = ({}: Props) => {
  const options = [
    { amount: 1, value: 1 },
    { amount: 10, value: 0.8 },
    { amount: 25, value: 0.5 },
  ];

  const [amountToBuy, setAmountToBuy] = useState<number>(
    Math.round((options[0].amount + options[1].amount) / 2)
  );

  const [isLoading, setIsLoading] = useState(false);

  function getOptionStyles(index: number) {
    return `${styles.option} ${index !== 0 && styles.borderLeft}`;
  }

  function getTotalPrize() {
    const option = options
      .slice()
      .reverse()
      .find((o) => amountToBuy >= o.amount);

    return `Total prize: ${option ? amountToBuy * option.value : 0}`;
  }

  function handleBuyMatchs() {
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
          <span>
            +10 games = 13.5{' '}
            <RenderCheddarIcon className={styles.cheddarIcon} /> each
          </span>
          <span>
            +25 games = 12 <RenderCheddarIcon className={styles.cheddarIcon} />{' '}
            each
          </span>
        </Flex>
      </Flex>
      <Flex className={styles.selectAmountContainer}>
        <Flex className={styles.amountOptionsSelector}>
          {options.map((option, index) => {
            return (
              <span
                key={`buy-match-option-selector-${index}`}
                className={getOptionStyles(index)}
                onClick={() => setAmountToBuy(Number(option.amount))}
              >
                {option.amount}
              </span>
            );
          })}
        </Flex>
        <NumberInput
          width={'70px'}
          defaultValue={Math.round((options[0].amount + options[1].amount) / 2)}
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
