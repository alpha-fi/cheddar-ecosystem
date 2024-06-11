import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Img,
  Link,
  Stack,
} from '@chakra-ui/react';
import { ButtonConnectWallet } from '../components/ButtonConnectWallet';
import thunderIcon from '../../../assets/thunder-icon.svg';
import swapIcon from '../../../assets/swap-icon.svg';
import GamesMenu from '../components/GamesMenu';
import { DrawerMenu } from '../components/DrawerMenu';
import { WhiteButton } from '../components/WhiteButton';

export default function Navbar() {
  return (
    <Box
      position="relative"
      as="nav"
      w="100%"
      h="60px"
      bg="#3331"
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
            <HStack spacing={0}>
              <Img
                src={'/assets/mouse-icon.svg'}
                alt=""
                width="32px"
                height="32px"
              />
              <Heading
                as="h1"
                size="md"
                mr="10px"
                alignSelf="center"
                letterSpacing="tighter"
              >
                Cheddar
              </Heading>
            </HStack>
            <Flex
              justifyContent="center"
              display={{ base: 'none', lg: 'flex' }}
            >
              <Link
                href="https://t.me/cheddarfarm"
                target="_blank"
                _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                minW="24px"
              >
                <Img
                  src={'/assets/telegram.svg'}
                  alt=""
                  width="16px"
                  height="16px"
                />
              </Link>
              <Link
                href="https://discord.com/invite/G9PTbmPUwe"
                target="_blank"
                _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                minW="24px"
              >
                <Img
                  src={'/assets/discord.svg'}
                  alt=""
                  width="16px"
                  height="16px"
                />
              </Link>
              <Link
                href="https://twitter.com/CheddarFi"
                target="_blank"
                _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                minW="24px"
              >
                <Img
                  src={'/assets/twitter.svg'}
                  alt=""
                  width="16px"
                  height="16px"
                />
              </Link>
              <Link
                href="https://cheddarfarm.gitbook.io/docs"
                target="_blank"
                _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
                minW="24px"
              >
                <Img
                  src={'/assets/gitbook.svg'}
                  alt=""
                  width="16px"
                  height="16px"
                />
              </Link>
            </Flex>
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
          >
            {/* <GamesMenu />
            <Link
              href="https://nft.cheddar.farm/"
              target="_blank"
              _focus={{ boxShadow: '0 0 0 0' }}
              _hover={{ textDecoration: 'none' }}
            >
              <WhiteButton>
                NFT
                <Box minW="30px" ml="6px">
                  <Img src={thunderIcon} alt="" width="24px" height="24px" />
                </Box>
              </WhiteButton>
            </Link>
            <Link
              href="https://app.ref.finance/#token.cheddar.near|token.v2.ref-finance.near"
              target="_blank"
              _focus={{ boxShadow: '0 0 0 0' }}
              _hover={{ textDecoration: 'none' }}
            >
              <WhiteButton>
                Swap
                <Box minW="30px" ml="10px">
                  <Img
                    bg="#6495ed70"
                    border="#6495ed70 2px solid"
                    padding="1px"
                    borderRadius="full"
                    src={swapIcon}
                    alt=""
                    width="24px"
                    height="24px"
                  />
                </Box>
              </WhiteButton>
            </Link> */}
          </Stack>
        </Flex>

        <Flex flexDir="row" justifyContent="end">
          <ButtonConnectWallet />
          <Box ml={2} display={{ base: 'inline-block', lg: 'none' }}>
            <DrawerMenu />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
