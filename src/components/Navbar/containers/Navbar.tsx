import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Img,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ButtonConnectWallet } from '../components/ButtonConnectWallet';
import thunderIcon from '../../../assets/thunder-icon.svg';
import swapIcon from '../../../assets/swap-icon.svg';
import GamesMenu from '../components/GamesMenu';
import { DrawerMenu } from '../components/DrawerMenu';
import { WhiteButton } from '../components/WhiteButton';
import { useContext } from 'react';
import { GameContext } from '@/contexts/GameContextProvider';
import { RenderCheddarIcon } from '@/components/RenderCheddarIcon';

interface Props {
  cheddarBalanceData: bigint | null | undefined;
}

export default function Navbar({ cheddarBalanceData }: Props) {
  const { onOpenVideoModal } = useContext(GameContext);

  return (
    <Box
      position="relative"
      as="nav"
      w="100%"
      h="60px"
      bg="#8542eb"
      css={{ backdropFilter: 'blur(2px)' }}
      zIndex={1}
    >
      <Container
        display="flex"
        alignContent="center"
        maxW="container.xl"
        justifyContent="space-between"
        alignItems="center"
        px="14px"
        height="100%"
      >
        <Flex alignContent="center">
          <Flex flexDirection="column" rowGap={1} mr="20px">
            <HStack spacing={0} onClick={onOpenVideoModal}>
              <Img src={'/assets/cheddar-logo.png'} alt="" height="25px" />
            </HStack>

            <Text
              display={{ base: 'none', lg: 'flex' }}
              justifyContent="space-between"
              w="100%"
            >
              <Text as="i">
                Total <RenderCheddarIcon /> suply moked:{' '}
              </Text>
              <Text>9999</Text>
            </Text>
          </Flex>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            display={{ base: 'none', lg: 'flex' }}
            width={{ base: 'full', md: 'auto' }}
            alignItems="center"
            justifyContent="center"
            flexGrow={1}
            mt={{ base: 4, md: 0 }}
            fontWeight="700"
            lineHeight="1"
          ></Stack>
        </Flex>

        <Flex flexDir="row" justifyContent="end">
          <ButtonConnectWallet cheddarBalanceData={cheddarBalanceData} />
          <Box ml={2} display={{ base: 'inline-block', lg: 'none' }}>
            <DrawerMenu />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
