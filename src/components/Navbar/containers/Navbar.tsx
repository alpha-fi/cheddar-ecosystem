import React, { useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Hide,
  HStack,
  Img,
  Show,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ButtonConnectWallet } from '../components/ButtonConnectWallet';
import { DrawerMenu } from '../components/DrawerMenu';
import styles from '@/styles/NavBar.module.css';

import { useGetCheddarTotalSupply } from '@/hooks/cheddar';
import { yton } from '@/contracts/contractUtils';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import { ModalContainer } from '@/components/ModalContainer';
import Link from 'next/link';
import { About } from '../components/About';
import { useContext, useState } from 'react';
import ModalHolonym from '@/components/ModalHolonymSBT';
import { GameContext } from '@/contexts/maze/GameContextProvider';

export default function Navbar() {
  const {
    isOpen: isVideoModalOpened,
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
  } = useDisclosure();

  const { data: cheddarTotalSupply, isLoading: isLoadingCheddarTotalSupply } =
    useGetCheddarTotalSupply();
  const [showHolonymModal, setHolonymModal] = useState(false);
  const { isUserHolonymVerified } = useContext(GameContext);
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
                <Show breakpoint="(max-width: 600px)">
                  <Img
                    src={'/assets/cheddar-logo-reduced.png'}
                    alt="Cheddar icon"
                    height={'50px'}
                  />
                </Show>
                <Hide breakpoint="(max-width: 600px)">
                  <Img
                    src={'/assets/cheddar-logo.png'}
                    alt="Cheddar icon"
                    height={'50px'}
                  />
                </Hide>
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
                  {/* <Link
                    href={'/checkers'}
                    style={{ textDecorationColor: 'white' }}
                  >
                    <Text fontSize={'16px'} fontWeight="600" color="white">
                      Checkers
                    </Text>
                  </Link> */}
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
                  {isLoadingCheddarTotalSupply
                    ? 'Loading'
                    : new Intl.NumberFormat('de-DE', {
                        maximumFractionDigits: 0,
                      }).format(yton(cheddarTotalSupply!))}{' '}
                  {RenderCheddarIcon({ width: '2rem', height: '1.5rem' })}
                </div>
              </Text>
            </Text>
            <About />
            {!isUserHolonymVerified && (
              <Button
                display={{ base: 'none', lg: 'flex' }}
                px={{ base: 2, md: 3 }}
                onClick={() => setHolonymModal(true)}
              >
                Get Holonym SBT
              </Button>
            )}
            <ModalHolonym
              isOpen={showHolonymModal}
              onClose={() => setHolonymModal(false)}
            />
            <ButtonConnectWallet />
            <Box ml={2} display={{ base: 'inline-block', lg: 'none' }}>
              <DrawerMenu
                onOpenVideoModal={onOpenVideoModal}
                cheddarTotalSupply={cheddarTotalSupply}
                isLoadingCheddarTotalSupply={isLoadingCheddarTotalSupply}
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
