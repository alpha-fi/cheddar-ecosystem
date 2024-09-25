import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { SocialMedia } from '@/components/SocialMediaContainer';
import { yton } from '@/contracts/contractUtils';
import { useContext } from 'react';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import { RenderCheddarIcon } from '@/components/maze/RenderCheddarIcon';
import Link from 'next/link';

interface Props {
  onOpenVideoModal: () => void;
  cheddarTotalSupply: bigint | undefined;
  isLoadingCheddarTotalSupply: boolean;
  setHolonymModal: (v: boolean) => void;
}

export function DrawerMenu({
  onOpenVideoModal,
  cheddarTotalSupply,
  isLoadingCheddarTotalSupply,
  setHolonymModal,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isUserHolonymVerified } = useContext(GameContext);

  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Menu"
        border="1px solid #3334"
        colorScheme="yellow"
        bg="yellowCheddar"
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
            _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
          />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" gap="0.5rem" px="0">
            {!isUserHolonymVerified && (
              <Button
                colorScheme="yellow"
                _hover={{ bg: 'yellowgreen' }}
                mx={3}
                px={{ base: 2, md: 3 }}
                onClick={() => {
                  setHolonymModal(true);
                  onClose();
                }}
              >
                Get Holonym SBT
              </Button>
            )}

            <Button mx={3} colorScheme="blue" onClick={onOpenVideoModal}>
              🎶
            </Button>
            <VStack spacing={'16px'} minW={'25px'}>
              <Link href={'/maze'} style={{ textDecorationColor: 'purple' }}>
                <Text fontSize={'16px'} fontWeight="600" color="purple">
                  Maze
                </Text>
              </Link>
              <Link
                href={'/checkers'}
                style={{ textDecorationColor: 'purple' }}
              >
                <Text fontSize={'16px'} fontWeight="600" color="purple">
                  Checkers
                </Text>
              </Link>
              <Link href={'/plinko'} style={{ textDecorationColor: 'purple' }}>
                <Text fontSize={'16px'} fontWeight="600" color="purple">
                  Plinko
                </Text>
              </Link>
            </VStack>
          </DrawerBody>

          <DrawerFooter
            flexDirection="column"
            borderTopWidth="1px"
            justifyContent="space-around"
          >
            <SocialMedia size="sm" />
            <Text display="flex" justifyContent="space-between" w="100%">
              <Text as="i" pb="0.5rem">
                Total supply:{' '}
                {isLoadingCheddarTotalSupply
                  ? 'Loading'
                  : new Intl.NumberFormat('de-DE', {
                      maximumFractionDigits: 0,
                    }).format(yton(cheddarTotalSupply!))}{' '}
                <RenderCheddarIcon />
              </Text>
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
