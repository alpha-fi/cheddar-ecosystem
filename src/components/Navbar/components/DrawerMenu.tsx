import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Img,
  Link,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import checkersIcon from '../../../assets/checkers-icon.png';
import gamepadIcon from '../../../assets/gamepad-icon.svg';
import cheddarIcon from '../../../assets/cheddar-icon.svg';
import thunderIcon from '../../../assets/thunder-icon.svg';
import swapIcon from '../../../assets/swap-icon.svg';
import telegramIcon from '../../../assets/telegram.svg';
import discordIcon from '../../../assets/discord.svg';
import twitterIcon from '../../../assets/twitter.svg';
import gitbookIcon from '../../../assets/gitbook.svg';
import { RenderCheddarIcon } from '@/components/RenderCheddarIcon';
import { SocialMedia } from '@/components/SocialMediaContainer';

export function DrawerMenu() {
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

          <DrawerBody px="0"></DrawerBody>

          <DrawerFooter
            flexDirection="column"
            borderTopWidth="1px"
            justifyContent="space-around"
          >
            <SocialMedia />
            <Text display="flex" justifyContent="space-between" w="100%">
              <Text as="i">
                Total <RenderCheddarIcon /> suply moked:{' '}
              </Text>
              <Text>9999</Text>
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
