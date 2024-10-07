import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Img,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ButtonConnectWallet } from '../components/ButtonConnectWallet';
import { DrawerMenu } from '../components/DrawerMenu';
import styles from '@/styles/NavBar.module.css';

import {
  useGetCheddarNearTotalSupply,
  useGetCheddarBaseTotalSupply,
} from '@/hooks/cheddar';
import { yton } from '@/contracts/contractUtils';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import { ModalContainer } from '@/components/ModalContainer';
import Link from 'next/link';
import { About } from '../components/About';
import { useContext, useState } from 'react';
import ModalHolonym from '@/components/ModalHolonymSBT';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { useAccount } from 'wagmi';
import { SelectWalletModal } from '../components/SelectWalletModal';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { BlockchainSelector } from '../components/BlockchainSelector';
import { WalletMenu } from '../components/WalletMenu';
import { getConfig } from '@/configs/config';

export default function Navbar() {
  const {
    isOpen: isVideoModalOpened,
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
  } = useDisclosure();

  const { nadaBotUrl } = getConfig().networkData;

  const { addresses, blockchain, isConnected, isUserVerified, cheddarTotalSupply, isCheddarTotalSupplyLoading } = useGlobalContext()

  const [showHolonymModal, setHolonymModal] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <>
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
          px="32px"
          gap="1rem"
          height="100%"
        >
          <Flex alignContent="center" minW={{ base: undefined, lg: '341px' }}>
            <Flex flexDirection="column" mr="20px">
              <HStack spacing={0} minW={'25px'}>
                <Img
                  src={'/assets/cheddar-logo.png'}
                  alt="Cheddar icon"
                  height="25px"
                />
              </HStack>
            </Flex>
          </Flex>

          {isDesktop && (
            <Flex alignContent="center">
              <Flex flexDirection="column" mr="20px">
                <HStack spacing={'16px'} minW={'25px'}>
                  <Link href={'/maze'} style={{ textDecorationColor: 'white' }}>
                    <Text fontSize={'16px'} fontWeight="600" color="white">
                      Maze
                    </Text>
                  </Link>
                  <Link
                    href={'/checkers'}
                    style={{ textDecorationColor: 'white' }}
                  >
                    <Text fontSize={'16px'} fontWeight="600" color="white">
                      Checkers
                    </Text>
                  </Link>
                </HStack>
              </Flex>
            </Flex>
          )}

          <Flex
            flexDir="row"
            justifyContent="end"
            gap="1rem"
            alignItems="center"
          >
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
              <Button
                _hover={{ bg: '#63b3ed' }}
                colorScheme="blue"
                onClick={onOpenVideoModal}
              >
                🎶
              </Button>
            </Stack>

            <Text
              display={{ base: 'none', lg: 'flex' }}
              justifyContent="space-between"
              textColor="white"
            >
              <Text as="i">
                Total supply:{' '}
                <div style={{ width: 'max-content' }}>
                  {
                    isCheddarTotalSupplyLoading ? 
                      'Loading'
                    : 
                      blockchain=== "near" ?
                        new Intl.NumberFormat('de-DE', {
                          maximumFractionDigits: 0,
                        }).format(yton(cheddarTotalSupply!))
                      : 
                        Number((cheddarTotalSupply as bigint) || 0)
                    }
                    {' '}
                  {RenderCheddarIcon({ width: '2rem', height: '1.5rem' })}
                </div>
              </Text>
            </Text>
            <About />

            {blockchain==="base" && isConnected && !isUserVerified && (
              <Button
                display={{ base: 'none', lg: 'flex' }}
                px={{ base: 2, md: 3 }}
                onClick={() => setHolonymModal(true)}
              >
                Get Holonym SBT
              </Button>
            )}
            {blockchain==="near" && isConnected && !isUserVerified && (
              <Button
                display={{ base: 'none', lg: 'flex' }}
                px={{ base: 2, md: 3 }}
                as={Link}
                href={nadaBotUrl}
                target='_blank'
              >
                Get NadaBot SBT
              </Button>
            )}
            <ModalHolonym
              isOpen={showHolonymModal}
              onClose={() => setHolonymModal(false)}
            />
            <BlockchainSelector/>
            <WalletMenu/>

            <Box ml={2} display={{ base: 'inline-block', lg: 'none' }}>
              <DrawerMenu
                onOpenVideoModal={onOpenVideoModal}
                setHolonymModal={setHolonymModal}
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      <ModalContainer
        title={'Cheddar rap'}
        isOpen={isVideoModalOpened}
        onClose={onCloseVideoModal}
      >
        <div className={styles.videoContainer}>
          <video
            src="../../../assets/cheddar_rap.mp4"
            autoPlay
            controls
          ></video>
        </div>
      </ModalContainer>
      <div className={styles.publicityDecoration}></div>
    </>
  );
}
