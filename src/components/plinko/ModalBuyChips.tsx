import {
  FormControl,
  FormLabel,
  Button,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
} from '@chakra-ui/react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { useContext, useState } from 'react';

import styles from '@/styles/BuyNFTSection.module.css';
import { RenderCheddarIcon } from '../maze/RenderCheddarIcon';
import { ModalContainer } from '../ModalContainer';
import { buyBalls } from '@/contracts/plinko/plinkoCalls';
import { useGetBallCost } from '@/hooks/plinko';
import { yton } from '@/contracts/contractUtils';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { PlinkoContext } from '@/contexts/plinko/PlinkoContextProvider';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const ModalBuyChips = ({ isOpen, onClose }: Props) => {
  const { setResetQuery, setThrownBallsQuantity } = useContext(PlinkoContext);

  const [isLoading, setIsLoading] = useState(false);
  const [selectAmountOfChips, setSelectAmountOfChips] = useState(3);
  const { selector } = useWalletSelector();
  const { data: chipPriceInCheddar, isLoading: isChipPriceInCheddarLoading } =
    useGetBallCost();
  const toast = useToast();

  const cheddarInfo = {
    name: 'Cheddar',
    price: isChipPriceInCheddarLoading ? 'Loading' : yton(chipPriceInCheddar!),
    icon: <RenderCheddarIcon className={styles.tokenIcon} />,
    color: 'yellow',
  };

  function getAmountOfChipsToBuy() {
    return (
      BigInt(selectAmountOfChips) * BigInt(chipPriceInCheddar!)
    ).toString();
  }

  async function handleBuy() {
    try {
      setIsLoading(true);
      const wallet = await selector.wallet();
      const amount = getAmountOfChipsToBuy();

      if (amount) {
        // const resp =
        await buyBalls(wallet, amount.toString()!);
        // const genericLastResult = await getTransactionLastResult(resp);
        // const lastResult: MintNFTLastResult = genericLastResult[1];

        setResetQuery(true);
        setThrownBallsQuantity(0);

        toast({
          title: "Let's play!",
          status: 'success',
          duration: 9000,
          position: 'bottom-right',
          isClosable: true,
        });
      } else {
        toast({
          title:
            'There was an error getting the chips price. Please, try again',
          status: 'error',
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

  function changeSelectedAmountOfChips(e: string) {
    setSelectAmountOfChips(Number(e));
  }

  function openToast() {
    toast({
      title: 'You have to buy at least 1 chip',
      status: 'error',
      duration: 9000,
      position: 'bottom-right',
      isClosable: true,
    });
  }

  return (
    <ModalContainer title="Buy More Chips" onClose={onClose} isOpen={isOpen}>
      <form className={styles.form}>
        <FormControl isRequired>
          <FormLabel>Amount of chips</FormLabel>
          <NumberInput
            onChange={changeSelectedAmountOfChips}
            size="md"
            maxW={24}
            defaultValue={3}
            min={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormLabel>
          <Flex>
            <p>
              {`Chip cost: ${cheddarInfo.price}`} {cheddarInfo.icon}
            </p>
            <p>
              {`Total cost: ${Number(cheddarInfo.price) * selectAmountOfChips}`}{' '}
              {cheddarInfo.icon}
            </p>
          </Flex>
        </FormLabel>
        {selectAmountOfChips === 0 ? (
          <Button
            colorScheme="yellow"
            onClick={openToast}
            isLoading={isLoading}
          >
            Purchase
          </Button>
        ) : (
          <Button
            colorScheme="yellow"
            onClick={handleBuy}
            isLoading={isLoading}
          >
            Purchase
          </Button>
        )}
      </form>
    </ModalContainer>
  );
};
