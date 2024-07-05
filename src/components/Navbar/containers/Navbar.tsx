import {
  Box,
  Button,
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
import { DrawerMenu } from '../components/DrawerMenu';
import { useContext } from 'react';
import { GameContext } from '@/contexts/GameContextProvider';
import { RenderCheddarIcon } from '@/components/RenderCheddarIcon';
import { useGetCheddarTotalSupply } from '@/hooks/cheddar';
import { yton } from '@/contracts/contractUtils';

interface Props {
  cheddarBalanceData: bigint | null | undefined;
}

export default function Navbar({ cheddarBalanceData }: Props) {
  const { onOpenVideoModal } = useContext(GameContext);

  const { data: cheddarTotalSupply, isLoading: isLoadingCheddarTotalSupply } =
    useGetCheddarTotalSupply();

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
        gap="1rem"
        height="100%"
      >
        <Flex alignContent="center">
          <Flex flexDirection="column" rowGap={1} mr="20px">
            <HStack spacing={0}>
              <Img src={'/assets/cheddar-logo.png'} alt="" height="25px" />
            </HStack>
          </Flex>
        </Flex>

        <Flex flexDir="row" justifyContent="end" gap="1rem" alignItems="center">
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
          >
            <Button colorScheme="blue" onClick={onOpenVideoModal}>
              🎶
            </Button>
          </Stack>

          <Text justifyContent="space-between" textColor="white">
            <Text as="i">
              Total supply:{' '}
              <div style={{ width: 'max-content' }}>
                {isLoadingCheddarTotalSupply
                  ? 'Loading'
                  : new Intl.NumberFormat('de-DE', {
                      maximumFractionDigits: 0,
                    }).format(yton(cheddarTotalSupply!))}{' '}
                {RenderCheddarIcon({ width: '2rem', height: '1.5rem' })}
              </div>
            </Text>
          </Text>

          <ButtonConnectWallet cheddarBalanceData={cheddarBalanceData} />
          <Box ml={2} display={{ base: 'inline-block', lg: 'none' }}>
            <DrawerMenu
              onOpenVideoModal={onOpenVideoModal}
              cheddarTotalSupply={cheddarTotalSupply}
              isLoadingCheddarTotalSupply={isLoadingCheddarTotalSupply}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
