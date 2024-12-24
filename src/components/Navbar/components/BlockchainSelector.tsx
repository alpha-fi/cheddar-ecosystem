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
    isOpen: isModalConfirmCloseOnGoingGameAndChangeBlockchainToBaseOpen,
    onOpen: onOpenModalConfirmCloseOnGoingGameAndChangeBlockchainToBase,
    onClose: onCloseModalConfirmCloseOnGoingGameAndChangeBlockchainToBase,
  } = useDisclosure();

  const {
    isOpen: isModalConfirmCloseOnGoingGameAndChangeBlockchainToNearOpen,
    onOpen: onOpenModalConfirmCloseOnGoingGameAndChangeBlockchainToNear,
    onClose: onCloseModalConfirmCloseOnGoingGameAndChangeBlockchainToNear,
  } = useDisclosure();

  function handleClickMenuItem(blockchainProp: Blockchain) {
    return () => {
      console.log('blockchainProp: ', blockchainProp);
      const savedGame = localStorage.getItem(localStorageSavedGameKey);

      if (savedGame === null) {
        setBlockchain(blockchainProp);
      } else if (blockchainProp !== blockchain) {
        const savedGameParsed = JSON.parse(savedGame) as StoredGameInfo;

        const remainingTimeWithStoredData = calculateRemainingTime(
          savedGameParsed.timestampStartStopTimerArray,
          savedGameParsed.timestampEndStopTimerArray,
          savedGameParsed.startTimestamp
        );

        if (remainingTimeWithStoredData <= 0) {
          setBlockchain(blockchainProp);
        } else {
          if (blockchainProp === 'near') {
            onOpenModalConfirmCloseOnGoingGameAndChangeBlockchainToBase();
          } else {
            onOpenModalConfirmCloseOnGoingGameAndChangeBlockchainToNear();
          }
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
          .map((item, index) => {
            return (
              <MenuItem
                key={`select-blockchain-${item[0]}-${index}`}
                onClick={handleClickMenuItem(item[0] as Blockchain)}
              >
                <HStack>
                  <Img
                    style={{ height: 20 }}
                    src={`/assets/${item[0]}-logo.svg`}
                  />
                  <ModalConfirmCloseOnGoingGameAndChangeBlockchain
                    key={`modal-confirm-close-on-going-game-${item[0]}`}
                    blockchain={item[0] as Blockchain}
                    isOpen={
                      item[0] === 'near'
                        ? isModalConfirmCloseOnGoingGameAndChangeBlockchainToBaseOpen
                        : isModalConfirmCloseOnGoingGameAndChangeBlockchainToNearOpen
                    }
                    onClose={
                      item[0] === 'near'
                        ? onCloseModalConfirmCloseOnGoingGameAndChangeBlockchainToBase
                        : onCloseModalConfirmCloseOnGoingGameAndChangeBlockchainToNear
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
