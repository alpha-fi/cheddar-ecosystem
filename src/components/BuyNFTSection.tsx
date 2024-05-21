import {
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { ModalContainer } from './FeedbackModal';
import { NFTCheddarContract } from '@/contracts/nftCheddarContract';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { RadioButtonBroup } from './RadioButtonGroup';
import { useState } from 'react';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { RenderNearIcon } from './RenderNearIcon';
import { error } from 'console';
import { buyNFT } from '@/contracts/cheddarCalls';

const tokensStyles = {
  marginLeft: '1rem',
  width: '2rem',
  minWidth: 'max-content',
  height: '2rem',
};

//The first option is the default one
const payingOptions = [
  {
    name: 'Cheddar',
    price: 0.5,
    icon: <RenderCheddarIcon styles={tokensStyles} />,
  },
  {
    name: 'Near',
    price: 0.5,
    icon: <RenderNearIcon styles={tokensStyles} />,
  },
];

export const RenderBuyNFTSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selector } = useWalletSelector();

  const [tokenToPayWith, setTokenToPayWith] = useState(payingOptions[0].name);
  const [errorMsg, setErrorMsg] = useState(undefined as undefined | string);

  const modalTitle = errorMsg ? 'Something went wrong' : 'Success';

  async function handlePurchase() {
    try {
      const wallet = await selector.wallet();
      await buyNFT(wallet, false);
      onOpen();
    } catch (err: any) {
      setErrorMsg(err);
      onOpen();
    }
  }

  return (
    <>
      <form style={{ display: 'flex', flexDirection: 'column' }}>
        <FormControl isRequired>
          <FormLabel>Chose token to pay with:</FormLabel>
          <RadioButtonBroup
            options={payingOptions}
            optionSelected={tokenToPayWith}
            setOptionSelected={setTokenToPayWith}
          />
        </FormControl>

        <FormLabel marginTop={'1rem'}>
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
      <ModalContainer title={modalTitle} isOpen={isOpen} onClose={onClose}>
        {errorMsg ? errorMsg : 'Enjoy your purchase!'}
      </ModalContainer>
    </>
  );
};
