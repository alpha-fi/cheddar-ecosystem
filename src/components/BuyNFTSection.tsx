import {
  Select,
  FormControl,
  FormLabel,
  Button,
  Stack,
} from '@chakra-ui/react';

//TODO get price and img calling the backend and processing the info
const price = 0.5;

export const RenderBuyNFTSection = () => {
  return (
    <form style={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl isRequired>
        <FormLabel>Chose token to pay with:</FormLabel>
        <Select placeholder="I'll pay with">
          <option value="cheddar">CHEDDAR</option>
          <option value="near">NEAR</option>
        </Select>
      </FormControl>

      <FormLabel marginTop={'1rem'}>
        Cost: {price}
        <Stack maxWidth={'30px'}>
          <svg className="mini-icon" viewBox="0 0 56 56">
            <style></style>
            <path
              d="M45 19.5V25l4.8.6V14.2c-.1-3.2-11.2-6.7-24.9-6.7S.1 11.1 0 14.2v18.3c0 3.2 10.7 7.1 24.5 7.1h.5V21.5l-4.7-7.2L45 19.5z"
              className="a"
            ></path>
            <path
              d="M25 31.5v-10l-4.7-7.2L45 19.5V25l-14-1.5v10l-6-2z"
              fill="#F9E295"
            ></path>
            <path
              d="M24.9 7.5C11.1 7.5 0 11.1 0 14.3s10.7 7.2 24.5 7.2h.5l-4.7-7.2 25 5.2c2.8-.9 4.4-4 4.4-5.2.1-3.2-11.1-6.8-24.8-6.8z"
              className="b"
            ></path>
            <path
              d="M36 29v19.6c8.3 0 15.6-1 20-2.5V26.5l-25-3.3 5 5.8z"
              className="a"
            ></path>
            <path
              d="m31 23.2 5 5.8c8.2 0 15.6-1 19.9-2.5L31 23.2z"
              className="b"
            ></path>
            <polygon
              points="36 29 36 48.5 31 42.5 31 23.2"
              fill="#FCDF76"
            ></polygon>
          </svg>
        </Stack>
      </FormLabel>
      <Button colorScheme="yellow" type="submit">
        Purchase
      </Button>
    </form>
  );
};
