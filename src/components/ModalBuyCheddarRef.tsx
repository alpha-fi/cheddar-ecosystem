import {
  FormControl,
  FormLabel,
  Button,
  useToast,
  Input,
  Box,
  Text,
  Image,
  InputGroup,
  InputLeftElement,
  Spinner,
  InputRightElement,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { RenderCheddarIcon } from './maze/RenderCheddarIcon';
import { getNearBalance } from '@/lib/near';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { ntoy, yton } from '@/contracts/contractUtils';
import _debounce from 'lodash/debounce';
import { ModalContainer } from './ModalContainer';
import Big from 'big.js';
import { swapNearToCheddar } from '@/contracts/tokenCheddarCalls';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const calculateCheddarAmount = async (nearAmount: number) => {
  const sendAmount = ntoy(nearAmount, 24);
  const tokenIn = 'wrap.near';
  const tokenOut = 'token.cheddar.near';
  const swapRes = await (
    await fetch(
      `https://smartrouter.ref.finance/findPath?amountIn=${sendAmount}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&pathDeep=3&slippage=0.001`
    )
  ).json();
  return {
    amount: new Big(swapRes.result_data.amount_out)
      .div(new Big(10).pow(24))
      .toFixed(4)
      .toString(),
    routes: swapRes.result_data.routes,
  };
};

const SwapComponent = () => {
  const [nearAmount, setNearAmount] = useState<number | string>('');
  const [cheddarAmount, setCheddarAmount] = useState<string>('');
  const [nearBalance, setNearBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [routes, setRoutes] = useState([]);
  const [isInsufficientBalance, setIsInsufficientBalance] =
    useState<boolean>(false);
  const [isCalculatingCheddar, setIsCalculatingCheddar] =
    useState<boolean>(false);
  const toast = useToast();
  const { addresses, blockchain, refreshCheddarBalance } = useGlobalContext();
  const { selector } = useWalletSelector();

  const fetchBalance = async () => {
    const balance = await getNearBalance(addresses[blockchain] as string);
    setNearBalance(yton(balance));
  };

  useEffect(() => {
    if (addresses[blockchain]) {
      fetchBalance();
    }
  }, [addresses, blockchain]);

  const debouncedCalculateCheddar = useCallback(
    _debounce(async (value: string) => {
      if (value && !isNaN(Number(value))) {
        setIsCalculatingCheddar(true);
        try {
          const { amount: cheddarAmountCalculated, routes } =
            await calculateCheddarAmount(Number(value));
          setRoutes(routes);
          setCheddarAmount(cheddarAmountCalculated);
        } catch (error) {
          console.error('Error calculating cheddar amount:', error);
          setCheddarAmount('');
          toast({
            title: 'Error calculating cheddar amount',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsCalculatingCheddar(false);
        }
      } else {
        setCheddarAmount('');
        setIsCalculatingCheddar(false);
      }
    }, 500),
    [nearBalance]
  );

  const handleNearAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNearAmount(value);
    setIsInsufficientBalance(Number(value) > nearBalance); // Check if the entered amount exceeds balance
    debouncedCalculateCheddar(value);
  };

  const handleSwap = async () => {
    if (Number(nearAmount) > nearBalance) {
      setIsInsufficientBalance(true);
      return;
    }

    setLoading(true);

    try {
      const wallet = await selector.wallet();
      // Perform swap logic here
      console.log('Swapping NEAR for Cheddar...');

      await swapNearToCheddar(wallet, routes, nearAmount.toString());

      toast({
        title: 'Swap Successful',
        description: `You swapped ${nearAmount} NEAR for ${cheddarAmount} Cheddar.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // refresh near and cheddar balance across website
      fetchBalance();
      refreshCheddarBalance();
    } catch (error) {
      toast({
        title: 'Swap failed',
        description: 'There was an error while processing the swap.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  if (!addresses[blockchain]) {
    return <div>PLease connect your wallet!!</div>;
  }
  return (
    <Box color="white">
      <FormControl mb="4">
        <FormLabel htmlFor="near-amount" color="white">
          NEAR Token Amount
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={
              <Image
                src="/assets/near-logo.svg"
                boxSize="24px"
                alt="NEAR token"
              />
            }
          />
          <Input
            id="near-amount"
            type="number"
            value={nearAmount}
            onChange={handleNearAmountChange}
            placeholder="Enter NEAR amount"
            bg="white"
            color="black"
          />
        </InputGroup>
        {isInsufficientBalance && (
          <Text color="red.400" mt="2" fontSize="sm">
            Insufficient balance. You cannot swap more than your available NEAR
            balance.
          </Text>
        )}
      </FormControl>

      <FormControl mb="4">
        <FormLabel htmlFor="cheddar-amount" color="white">
          Cheddar Token Amount
        </FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <RenderCheddarIcon />
          </InputLeftElement>
          <Input
            id="cheddar-amount"
            type="number"
            value={cheddarAmount}
            isReadOnly
            placeholder="Cheddar"
            bg="white"
            color="black"
          />
          {isCalculatingCheddar && (
            <InputRightElement>
              <Spinner size="sm" color="yellow.500" />
            </InputRightElement>
          )}
        </InputGroup>
      </FormControl>

      <Text mb="4" fontSize="sm" color="#ECC94B">
        Available NEAR balance: {nearBalance} NEAR
      </Text>

      <Button
        colorScheme="yellow"
        bg="#ECC94B"
        color="black"
        onClick={handleSwap}
        isLoading={loading}
        isDisabled={
          !cheddarAmount ||
          Number(nearAmount) <= 0 ||
          isNaN(Number(nearAmount)) ||
          Number(nearAmount) > nearBalance
        }
        _hover={{
          bg: '#D69E2E',
        }}
      >
        Swap
      </Button>
    </Box>
  );
};

export const ModalBuyCheddar = ({ isOpen, onClose }: Props) => {
  return (
    <ModalContainer
      title="Swap NEAR To Cheddar"
      onClose={onClose}
      isOpen={isOpen}
    >
      <SwapComponent />
    </ModalContainer>
  );
};
