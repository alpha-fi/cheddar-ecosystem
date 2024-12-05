import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Circle,
  HStack,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Blockchain, useGlobalContext } from '@/contexts/GlobalContext';
import { localStorageSavedGameKey } from '@/constants/maze';
import {
  GameContext,
  StoredGameInfo,
} from '@/contexts/maze/GameContextProvider';
import { useContext, useEffect } from 'react';
import { ModalConfirmCloseOnGoingGameAndChangeBlockchain } from './ModalConfirmCloseOnGoingGameAndChangeBlockchain';

export function BlockchainSelector() {
  const { blockchain, setBlockchain, addresses } = useGlobalContext();

  const { calculateRemainingTime } = useContext(GameContext);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const {
    isOpen: isModalConfirmCloseOnGoingGameAndChangeBlockchainOpen,
    onOpen: onOpenModalConfirmCloseOnGoingGameAndChangeBlockchain,
    onClose: onCloseModalConfirmCloseOnGoingGameAndChangeBlockchain,
  } = useDisclosure();

  function handleClickMenuItem(item: Blockchain) {
    return () => {
      const savedGame = localStorage.getItem(localStorageSavedGameKey);

      if (savedGame === null) {
        setBlockchain(item);
      } else {
        const savedGameParsed = JSON.parse(savedGame) as StoredGameInfo;

        const remainingTimeWithStoredData = calculateRemainingTime(
          savedGameParsed.timestampStartStopTimerArray,
          savedGameParsed.timestampEndStopTimerArray,
          savedGameParsed.startTimestamp
        );

        if (remainingTimeWithStoredData <= 0) {
          setBlockchain(item);
        } else {
          onOpenModalConfirmCloseOnGoingGameAndChangeBlockchain();
        }
      }
    };
  }

  return (
    <Menu>
      <MenuButton
        px={{ base: 2, md: 3 }}
        py={{ base: 1, md: 4 }}
        fontSize={{ base: 14, md: 16 }}
        border="1px solid #3334"
        as={Button}
        borderRadius="full"
        rightIcon={<ChevronDownIcon />}
      >
        <HStack>
          <Img style={{ height: 20 }} src={`/assets/${blockchain}-logo.svg`} />
          <Text hidden={isMobile}>{blockchain.toLocaleUpperCase()}</Text>
        </HStack>
      </MenuButton>
      <MenuList minWidth="auto" p="0" borderRadius="full" bg="yellowCheddar">
        {Object.entries(addresses)
          .sort((a, b) => (Boolean(a[1]) !== Boolean(b[1]) ? 1 : -1))
          .map((item) => {
            return (
              <MenuItem onClick={handleClickMenuItem(item[0] as Blockchain)}>
                <HStack>
                  <Img
                    style={{ height: 20 }}
                    src={`/assets/${item[0]}-logo.svg`}
                  />
                  <ModalConfirmCloseOnGoingGameAndChangeBlockchain
                    blockchain={item[0] as Blockchain}
                    isOpen={
                      isModalConfirmCloseOnGoingGameAndChangeBlockchainOpen
                    }
                    onClose={
                      onCloseModalConfirmCloseOnGoingGameAndChangeBlockchain
                    }
                  />
                  <Text>{item[0].toUpperCase()}</Text>
                  <Circle
                    size={'9px'}
                    bg={addresses[item[0]] ? '#00D26D' : '#7D8491'}
                  ></Circle>
                </HStack>
              </MenuItem>
            );
          })}
      </MenuList>
    </Menu>
  );
}
