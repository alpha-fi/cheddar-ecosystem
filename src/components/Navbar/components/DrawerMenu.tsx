import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RenderCheddarIcon } from '@/components/RenderCheddarIcon';
import { SocialMedia } from '@/components/SocialMediaContainer';
import { yton } from '@/contracts/contractUtils';

interface Props {
  onOpenVideoModal: () => void;
  cheddarTotalSupply: bigint | undefined;
  isLoadingCheddarTotalSupply: boolean;
}

export function DrawerMenu({
  onOpenVideoModal,
  cheddarTotalSupply,
  isLoadingCheddarTotalSupply,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            <Button colorScheme="blue" onClick={onOpenVideoModal}>
              🎶
            </Button>
            <Button>Scoreboard</Button>
          </DrawerBody>

          <DrawerFooter
            flexDirection="column"
            borderTopWidth="1px"
            justifyContent="space-around"
          >
            <SocialMedia />
            <Text display="flex" justifyContent="space-between" w="100%">
              <Text as="i">Total supply:</Text>
              <Text>
                {isLoadingCheddarTotalSupply
                  ? 'Loading'
                  : yton(cheddarTotalSupply!)}
                <RenderCheddarIcon />
              </Text>
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
