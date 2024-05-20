import {
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export const BuyNFTCard = (data: any) => {
  const { imgSrc, price, name, id } = data;
  return (
    <Center py={6}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        width={'90%'}
        direction={'column'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        padding={4}
      >
        <Flex flex={1} bg="blue.200">
          <Image objectFit="cover" boxSize="100%" src={imgSrc} />
        </Flex>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={2}
        >
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            {name}
          </Heading>
          <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
            #{id}
          </Text>

          <Stack
            width={'100%'}
            padding={2}
            justifyContent={'space-between'}
            alignItems={'center'}
            flexDirection={'row'}
          >
            <Text size="sm" fontWeight={600}>
              Price: ${price}
            </Text>

            <Button colorScheme="yellow">Buy</Button>
          </Stack>
        </Stack>
      </Stack>
    </Center>
  );
};
