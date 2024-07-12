import { Box, Img, Link } from '@chakra-ui/react';
import styles from '../styles/SocialMedia.module.css';

export const SocialMedia = () => {
  return (
    <Box
      className={
        styles.container
      }
    >
      <Link
        display="flex"
        href="https://t.me/cheddarfarm"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/telegram.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        display="flex"
        href="https://discord.com/invite/G9PTbmPUwe"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/discord.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        display="flex"
        href="https://twitter.com/CheddarFi"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/twitter.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        display="flex"
        href="https://cheddarfarm.gitbook.io/docs"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/gitbook.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        display="flex"
        href="https://near.social/chatter.cheddar.near/widget/home"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/chat.svg'} alt="" width="20px" height="20px" />
        </Box>
      </Link>
    </Box>
  );
};
